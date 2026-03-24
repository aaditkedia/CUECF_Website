import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import * as THREE from 'three';
import { completedProjects, ongoingProjects } from '../data/projects';
import './Map3D.css';

// --- Web Audio Setup ---
let audioCtx = null;
let ambientOsc = null;
let ambientGain = null;

const initAudio = () => {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  // Ambient Drone
  ambientOsc = audioCtx.createOscillator();
  ambientGain = audioCtx.createGain();
  ambientOsc.type = 'sine';
  ambientOsc.frequency.value = 55; // Low bass drone for space ambiance
  ambientGain.gain.value = 0; // Starts silent
  
  ambientOsc.connect(ambientGain);
  ambientGain.connect(audioCtx.destination);
  ambientOsc.start();
};

const playChime = () => {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'sine';
  // Random, pleasant chime pitch
  osc.frequency.setValueAtTime(440 + Math.random() * 440, audioCtx.currentTime); 
  osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.5);
  
  gain.gain.setValueAtTime(0, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 1.5);
};

export default function Map3D() {
  const fgRef = useRef();
  const containerRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [hiddenGroups, setHiddenGroups] = useState(new Set());

  // --- Graph Data Construction ---
  const graphData = useMemo(() => {
    const rawProjects = [...completedProjects, ...ongoingProjects];
    const nodesMap = new Map();
    const links = [];

    const cleanPartnerName = (rawName) => {
      if (!rawName) return "Various";
      let name = rawName
        .replace(/Developed in (conjunction|collaboration) with /i, '')
        .replace(/Project with /i, '')
        .replace(/Contacted:\s*/i, '')
        .replace(/ and its Conservation Club/i, '');
      
      // Strip people's names (anything after the first comma usually)
      if (name.includes(',')) {
        name = name.split(',')[0];
      }
      return name.trim();
    };

    const wrapText = (str, maxLen = 22) => {
      if (!str) return 'Unknown';
      let clean = str
        .replace(/in collaboration with .+/ig, '')
        .replace(/Collaboration with /ig, '')
        .replace(/Project with /ig, '')
        .trim();
        
      const words = clean.split(' ');
      let lines = [];
      let currentLine = '';
      
      words.forEach(word => {
        if ((currentLine + word).length > maxLen) {
          if (currentLine) lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      });
      if (currentLine) lines.push(currentLine.trim());
      
      return lines.join('\n');
    };

    rawProjects.forEach(proj => {
      const pName = cleanPartnerName(proj.partner);
      
      if (!nodesMap.has(pName)) {
        nodesMap.set(pName, {
          id: pName,
          label: wrapText(pName),
          group: 'partner',
          val: 27,
          color: '#e84393' 
        });
      }

      const projId = proj.id;
      if (!nodesMap.has(projId)) {
        nodesMap.set(projId, {
          id: projId,
          label: wrapText(proj.title),
          group: 'project',
          val: 4,
          color: '#74b9ff'
        });
      }

      links.push({
        source: projId,
        target: pName
      });
    });

    return {
      nodes: Array.from(nodesMap.values()),
      links
    };
  }, []);

  // --- Filtering ---
  const handleToggleGroup = (group) => {
    setHiddenGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };

  // --- Force Adjustments & Ambiance ---
  useEffect(() => {
    if (fgRef.current) {
      // Pull nodes closer together
      fgRef.current.d3Force('charge').strength(-15);
      
      // Add stars
      const scene = fgRef.current.scene();
      const starsGeometry = new THREE.BufferGeometry();
      const starVertices = [];
      for (let i = 0; i < 2000; i++) {
        starVertices.push(
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 4000
        );
      }
      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        transparent: true,
        opacity: 0.6,
      });
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
    }
  }, []);

  // --- Audio Control ---
  useEffect(() => {
    if (isAudioEnabled) {
      initAudio();
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (ambientGain) {
        ambientGain.gain.setTargetAtTime(0.05, audioCtx.currentTime, 1); // Fade in drone
      }
    } else {
      if (ambientGain && audioCtx) {
        ambientGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5); // Fade out drone
      }
    }
  }, [isAudioEnabled]);

  // --- Fullscreen ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- Node Events ---
  const handleNodeClick = useCallback((node) => {
    if (isAudioEnabled) playChime();
    
    // Zoom in slightly on clicked node
    if (fgRef.current) {
      const distance = 100;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
      fgRef.current.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node, // lookAt
        1500  // ms transition
      );
    }
  }, [isAudioEnabled]);

  return (
    <div className="map-3d-page">
      {!isFullscreen && (
        <div className="map-header">
          <h1>Accomplishments 3D Map</h1>
          <p>Explore our partners and the projects we've built together.</p>
        </div>
      )}
      
      <div className="map-container" ref={containerRef}>
        
        {/* UI Overlay */}
        <div className="map-ui-overlay">
          <div className="map-controls">
            <button className="map-btn" onClick={toggleFullscreen}>
              {isFullscreen ? '⛌ Exit Fullscreen' : '⛶ Fullscreen'}
            </button>
            <button className={`map-btn ${isAudioEnabled ? 'active' : ''}`} onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
              {isAudioEnabled ? '🔊 Sound On' : '🔇 Muted'}
            </button>
          </div>

          <div className="map-legend">
            <h3>Legend & Filters</h3>
            <label className="legend-item">
              <input 
                type="checkbox" 
                checked={!hiddenGroups.has('partner')} 
                onChange={() => handleToggleGroup('partner')} 
              />
              <span className="legend-color map-partner-color"></span>
              Partners
            </label>
            <label className="legend-item">
              <input 
                type="checkbox" 
                checked={!hiddenGroups.has('project')} 
                onChange={() => handleToggleGroup('project')} 
              />
              <span className="legend-color map-project-color"></span>
              Projects
            </label>
          </div>
        </div>

        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeVisibility={node => !hiddenGroups.has(node.group)}
          linkVisibility={link => !hiddenGroups.has(link.source.group) && !hiddenGroups.has(link.target.group)}
          backgroundColor="#0a0a1a"
          linkColor={() => 'rgba(108, 92, 231, 0.5)'}
          linkWidth={1.5}
          linkDirectionalParticles={0} 
          onNodeClick={handleNodeClick}
          nodeThreeObject={node => {
            const group = new THREE.Group();

            const radius = node.group === 'partner' ? 12 : 6;
            
            // Sphere Bubble
            const geometry = new THREE.SphereGeometry(radius, 32, 32);
            const material = new THREE.MeshPhongMaterial({
              color: node.color,
              emissive: node.color,
              emissiveIntensity: 0.35,
              shininess: 80,
              transparent: true,
              opacity: 0.92,
            });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            // Text Label Below
            const sprite = new SpriteText(node.label);
            sprite.color = '#ffffff';
            // Increased text size as requested
            sprite.textHeight = node.group === 'partner' ? 10 : 6;
            sprite.position.y = -(radius + sprite.textHeight); 
            group.add(sprite);

            return group;
          }}
          // The charge is adjusted in useEffect, but we can set decay here
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.1}
          cooldownTicks={100}
        />
      </div>
    </div>
  );
}

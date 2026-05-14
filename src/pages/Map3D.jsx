import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import ForceGraph2D from 'react-force-graph-2d';
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
  const focusedNodeRef = useRef(null); // Track node for orbital camera
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [hiddenGroups, setHiddenGroups] = useState(new Set());
  const [is2DMode, setIs2DMode] = useState(false);

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
      
      if (name.includes(',')) {
        name = name.split(',')[0];
      }
      name = name.trim();

      // Deduplicate similar partner names
      if (/Wildlands|Wildlife/i.test(name)) return "Wildlands Conservancy";
      if (/Whitehall/i.test(name)) return "Whitehall Township";
      if (/Lehigh County Conservation|LCCD/i.test(name)) return "Lehigh County Conservation District";
      if (/Community United/i.test(name)) return "CUECF";
      if (/Jay's Eagle/i.test(name)) return "Jay's Eagle Scout";

      return name;
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

  const partnersList = useMemo(() => graphData.nodes.filter(n => n.group === 'partner').sort((a,b) => a.id.localeCompare(b.id)), [graphData]);

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

  // --- Orbital Animation ---
  useEffect(() => {
    let animationFrameId;

    const tick = () => {
      if (focusedNodeRef.current && fgRef.current && !is2DMode) {
        const distance = 80;
        const angle = Date.now() / 2000; // Speed of rotation
        
        // Ensure node has coordinates
        if (focusedNodeRef.current.x !== undefined) {
          fgRef.current.cameraPosition(
            {
              x: focusedNodeRef.current.x + distance * Math.cos(angle),
              y: focusedNodeRef.current.y + 20,
              z: focusedNodeRef.current.z + distance * Math.sin(angle),
            },
            focusedNodeRef.current, // Look at node
            0 // Instant update per tick
          );
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    return () => cancelAnimationFrame(animationFrameId);
  }, [is2DMode]);

  // --- Force Adjustments & Ambiance ---
  useEffect(() => {
    if (fgRef.current) {
      // Pull nodes closer together in both 2D and 3D
      fgRef.current.d3Force('charge').strength(-30);

      // Only 3D supports injected scene parameters (stars, fog)
      if (!is2DMode && typeof fgRef.current.scene === 'function') {
        const scene = fgRef.current.scene();
        
        // Ensure we don't duplicate on re-renders
        if (!scene.getObjectByName('starfield')) {
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
          stars.name = 'starfield';
          scene.add(stars);

          // Add fog to fade out distant nodes and reduce clutter
          scene.fog = new THREE.FogExp2('#0a0a1a', 0.0025);
        }
      }
    }
  }, [is2DMode]);

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

  // --- Navigation & Teleportation ---
  const flyToNode = useCallback((node) => {
    if (!fgRef.current || !node) return;

    if (is2DMode) {
      // 2D Camera logic
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(8, 1000); // 8x scale
    } else {
      // 3D Camera logic
      const distance = 80;
      const angle = Date.now() / 2000;
      
      fgRef.current.cameraPosition(
        { 
          x: node.x + distance * Math.cos(angle), 
          y: node.y + 20, 
          z: node.z + distance * Math.sin(angle) 
        },
        node, // lookAt
        1500  // ms transition
      );

      // Lock into orbit after transition finishes
      setTimeout(() => {
        focusedNodeRef.current = node;
      }, 1500);
    }
  }, [is2DMode]);

  const handleNodeClick = useCallback((node) => {
    if (isAudioEnabled) playChime();
    flyToNode(node);
  }, [isAudioEnabled, flyToNode]);

  const handleBackgroundClick = useCallback(() => {
    focusedNodeRef.current = null; // Stop orbiting
  }, []);

  const handleTeleportChange = (e) => {
    const partnerId = e.target.value;
    if (!partnerId) return;
    
    const node = graphData.nodes.find(n => n.id === partnerId);
    if (node) {
      flyToNode(node);
    }
    // reset selection so same item can be clicked again
    e.target.value = "";
  };

  const handleModeToggle = () => {
    setIs2DMode(!is2DMode);
    focusedNodeRef.current = null; // Reset orbit when switching modes
  };

  // Common Props for both Map Types
  const commonForceProps = {
    ref: fgRef,
    graphData: graphData,
    nodeVisibility: node => !hiddenGroups.has(node.group),
    linkVisibility: link => !hiddenGroups.has(link.source.group) && !hiddenGroups.has(link.target.group),
    backgroundColor: "#0a0a1a",
    linkColor: () => 'rgba(255, 255, 255, 0.45)',
    linkWidth: 2,
    linkDirectionalParticles: 2, // Flowing energy particles
    linkDirectionalParticleSpeed: 0.005,
    onNodeClick: handleNodeClick,
    onBackgroundClick: handleBackgroundClick,
    d3AlphaDecay: 0.01,
    d3VelocityDecay: 0.1,
    cooldownTicks: 100
  };

  return (
    <div className="map-3d-page">
      {!isFullscreen && (
        <div className="map-header">
          <h1>Accomplishments 3D Map</h1>
          <p>
            This interactive map represents our community network. 
            The large pink spheres represent our dedicated partners, while the blue spheres are 
            the specific conservation projects we've spearheaded together. 
            You can drag, zoom, and spin the globe, or click specific nodes to focus on them!
          </p>
        </div>
      )}
      
      <div className="map-container" ref={containerRef}>
        
        {/* UI Overlay */}
        <div className="map-ui-overlay">
          <div className="map-controls">
            <button className="map-btn map-btn-highlight" onClick={handleModeToggle}>
              {is2DMode ? 'View 3D 🌐' : 'View 2D 🗺️'}
            </button>
            <button className="map-btn" onClick={toggleFullscreen}>
              {isFullscreen ? '⛌ Exit Fullscreen' : '⛶ Fullscreen'}
            </button>
            <button className={`map-btn ${isAudioEnabled ? 'active' : ''}`} onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
              {isAudioEnabled ? '🔊 Sound On' : '🔇 Muted'}
            </button>
          </div>

          <div className="map-teleport">
            <select className="teleport-dropdown" defaultValue="" onChange={handleTeleportChange}>
              <option value="" disabled>🚀 Jump to Partner...</option>
              {partnersList.map(partner => (
                <option key={partner.id} value={partner.id}>
                  {partner.id}
                </option>
              ))}
            </select>
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

        {is2DMode ? (
          <ForceGraph2D
            {...commonForceProps}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const isPartner = node.group === 'partner';
              const radius = isPartner ? 14 : 7;
              const fontSize = isPartner ? 10 : 6;
              
              // Draw node orb
              ctx.beginPath();
              ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = isPartner ? 'rgba(232, 67, 147, 0.65)' : 'rgba(116, 185, 255, 0.65)';
              ctx.fill();

              // Node subtle border
              ctx.lineWidth = 1.5 / globalScale;
              ctx.strokeStyle = isPartner ? '#e84393' : '#74b9ff';
              ctx.stroke();

              // Draw multiline text labels
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.font = `500 ${fontSize}px Inter, Sans-Serif`;
              
              const lines = node.label.split('\n');
              lines.forEach((line, index) => {
                ctx.fillText(line, node.x, node.y + radius + fontSize + (index * fontSize * 1.2));
              });
            }}
          />
        ) : (
          <ForceGraph3D
            {...commonForceProps}
            nodeThreeObject={node => {
              const group = new THREE.Group();

              const radius = node.group === 'partner' ? 14 : 7;
              
              // Sphere Bubble
              const geometry = new THREE.SphereGeometry(radius, 32, 32);
              
              // New Physical Material for a beautiful glass effect
              const material = new THREE.MeshPhysicalMaterial({
                color: node.color,
                transmission: 0.9,
                opacity: 1,
                metalness: 0.2,
                roughness: 0.1,
                ior: 1.5,
                thickness: 0.5,
                transparent: true,
              });
              
              const sphere = new THREE.Mesh(geometry, material);
              group.add(sphere);

              // Text Label Below
              const sprite = new SpriteText(node.label);
              sprite.color = '#ffffff';
              // Set appropriate scaling for readability
              sprite.textHeight = node.group === 'partner' ? 10 : 6;
              sprite.position.y = -(radius + sprite.textHeight); 
              group.add(sprite);

              return group;
            }}
          />
        )}
      </div>
    </div>
  );
}

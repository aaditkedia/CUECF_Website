import React, { useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { completedProjects, ongoingProjects } from '../data/projects';
import './Map3D.css';

import * as THREE from 'three';

export default function Map3D() {
  const graphData = useMemo(() => {
    const rawProjects = [...completedProjects, ...ongoingProjects];
    const nodesMap = new Map();
    const links = [];

    // Helper to extract clean partner name
    const cleanPartnerName = (rawName) => {
      if (!rawName) return "Various";
      let name = rawName
        .replace(/Developed in (conjunction|collaboration) with /i, '')
        .replace(/Project with /i, '')
        .replace(/Contacted:\s*/i, '')
        .replace(/ and its Conservation Club/i, '')
        .trim();
      return name;
    };

    rawProjects.forEach(proj => {
      const pName = cleanPartnerName(proj.partner);
      
      // Ensure partner node exists
      if (!nodesMap.has(pName)) {
        nodesMap.set(pName, {
          id: pName,
          label: pName,
          group: 'partner',
          val: 27,
          color: '#e84393' // Match some distinct Brain Planner colors
        });
      }

      // Add project node
      const projId = proj.id;
      if (!nodesMap.has(projId)) {
        nodesMap.set(projId, {
          id: projId,
          label: proj.title,
          group: 'project',
          val: 4,
          color: '#74b9ff'
        });
      }

      // Add link
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

  return (
    <div className="map-3d-page">
      <div className="map-header">
        <h1>Accomplishments 3D Map</h1>
        <p>Explore our partners and the projects we've built together.</p>
      </div>
      
      <div className="map-container">
        <ForceGraph3D
          graphData={graphData}
          backgroundColor="#0a0a1a"
          linkColor={() => 'rgba(108, 92, 231, 0.5)'}
          linkWidth={1.5}
          linkDirectionalParticles={0} // Based on standard brain planner there's no particles
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
            sprite.textHeight = node.group === 'partner' ? 6 : 4;
            sprite.position.y = -(radius + sprite.textHeight); 
            group.add(sprite);

            return group;
          }}
          // Enhance repulsion between nodes to give them more breathing room
          d3Force="charge"
          d3AlphaDecay={0.01}
          d3VelocityDecay={0.1}
          cooldownTicks={100}
        />
      </div>
    </div>
  );
}

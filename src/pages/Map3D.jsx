import React, { useMemo } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { completedProjects, ongoingProjects } from '../data/projects';
import './Map3D.css';

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
          val: 25,
          color: '#10b981' // Green
        });
      }

      // Add project node
      const projId = proj.id;
      if (!nodesMap.has(projId)) {
        nodesMap.set(projId, {
          id: projId,
          label: proj.title,
          group: 'project',
          val: 10,
          color: '#3b82f6' // Blue
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
          nodeAutoColorBy="group"
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          nodeThreeObject={node => {
            const sprite = new SpriteText(node.label);
            sprite.color = '#ffffff';
            sprite.backgroundColor = node.color;
            sprite.padding = [4, 2];
            sprite.textHeight = node.group === 'partner' ? 6 : 4;
            sprite.borderRadius = 4;
            return sprite;
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

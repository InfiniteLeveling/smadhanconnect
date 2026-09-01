import React, { useEffect, useRef } from 'react';

/**
 * High-performance, lightweight 3D/2.5D Civic Network Canvas.
 * Renders a slow-moving abstract 3D civic mesh, glowing green nodes,
 * connecting neural synapses, and floating depth particles.
 * 
 * Metaphor: Citizens ↔ Government ↔ Universities ↔ Industry ↔ Solutions
 */
export const CivicNetworkCanvas = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = (canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1));
    let height = (canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1));
    let cssWidth = canvas.offsetWidth;
    let cssHeight = canvas.offsetHeight;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = canvas.offsetWidth;
      cssHeight = canvas.offsetHeight;
      width = canvas.width = cssWidth * dpr;
      height = canvas.height = cssHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.scale(dpr, dpr);

    window.addEventListener('resize', handleResize);

    // Mouse Parallax
    let mouse = { x: cssWidth * 0.7, y: cssHeight * 0.4, targetX: cssWidth * 0.7, targetY: cssHeight * 0.4 };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 1. Particle Cloud (Floating Ambient Dust + Glowing Nodes)
    const PARTICLE_COUNT = 38;
    const particles = [];
    const NODE_LABELS = ['Citizen', 'Govt', 'Academia', 'Industry', 'AI Triage', 'IoT Feed', 'Solution', 'District 24'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * cssWidth,
        y: Math.random() * cssHeight,
        z: Math.random() * 400 - 200, // 3D depth (-200 to 200)
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2.8 + 1.2,
        isMajorNode: i < 8,
        label: i < 8 ? NODE_LABELS[i] : null,
        pulsePhase: Math.random() * Math.PI * 2,
        color: i % 3 === 0 ? 'rgba(34, 197, 94, ' : i % 3 === 1 ? 'rgba(16, 185, 129, ' : 'rgba(5, 150, 105, '
      });
    }

    // 2. 3D Geometric Civic Polyhedron (Wireframe Icosahedron/Octahedron)
    // Vertices in 3D local coordinate space
    const phi = (1 + Math.sqrt(5)) / 2; // golden ratio
    const geomScale = 110;
    const rawVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(v => ({ x: v[0] * geomScale, y: v[1] * geomScale, z: v[2] * geomScale }));

    // Edge connectivity
    const edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [1, 9], [1, 8], [1, 7],
      [2, 11], [2, 4], [2, 3], [2, 6], [2, 10],
      [3, 4], [3, 9], [3, 8], [3, 6],
      [4, 5], [4, 9], [4, 11],
      [5, 9], [5, 11],
      [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10],
      [8, 9],
      [10, 11]
    ];

    let rotX = 0.2;
    let rotY = 0.3;
    let rotZ = 0.1;

    // Visibility Observer to pause when off-screen
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvas);

    let lastTime = performance.now();

    const render = (time) => {
      animationFrameId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Soft ambient background aura in the top-right / center-right
      const bgCenterX = cssWidth * 0.72 + (mouse.x - cssWidth * 0.5) * 0.04;
      const bgCenterY = cssHeight * 0.45 + (mouse.y - cssHeight * 0.5) * 0.04;

      const radialGlow = ctx.createRadialGradient(
        bgCenterX, bgCenterY, 20,
        bgCenterX, bgCenterY, Math.max(cssWidth, cssHeight) * 0.55
      );
      radialGlow.addColorStop(0, 'rgba(34, 197, 94, 0.12)');
      radialGlow.addColorStop(0.4, 'rgba(16, 185, 129, 0.05)');
      radialGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // --- RENDER 3D ROTATING GEOMETRY ---
      const speedMultiplier = prefersReducedMotion ? 0.1 : 1;
      rotX += 0.12 * dt * speedMultiplier;
      rotY += 0.18 * dt * speedMultiplier;
      rotZ += 0.08 * dt * speedMultiplier;

      // 3D Geometry Center anchored near right-side hero
      const geomCenterX = cssWidth * 0.74 + (mouse.x - cssWidth * 0.5) * 0.05;
      const geomCenterY = cssHeight * 0.46 + (mouse.y - cssHeight * 0.5) * 0.05;
      const cameraDistance = 380;

      // Rotate and project vertices
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosZ = Math.cos(rotZ), sinZ = Math.sin(rotZ);

      const projectedVertices = rawVertices.map((v) => {
        // Rot Y
        let x1 = v.x * cosY + v.z * sinY;
        let y1 = v.y;
        let z1 = -v.x * sinY + v.z * cosY;

        // Rot X
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Rot Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        // Perspective projection
        const scale = cameraDistance / (cameraDistance + z3 + 120);
        return {
          px: geomCenterX + x3 * scale,
          py: geomCenterY + y3 * scale,
          z: z3,
          scale: scale
        };
      });

      // Draw Geometry Edges
      ctx.lineWidth = 1.1;
      for (let i = 0; i < edges.length; i++) {
        const [idxA, idxB] = edges[i];
        const vA = projectedVertices[idxA];
        const vB = projectedVertices[idxB];
        
        // Depth-based opacity
        const avgZ = (vA.z + vB.z) / 2;
        const edgeAlpha = Math.max(0.04, Math.min(0.28, (avgZ + 150) / 300 * 0.28));
        
        ctx.strokeStyle = `rgba(22, 163, 74, ${edgeAlpha})`;
        ctx.beginPath();
        ctx.moveTo(vA.px, vA.py);
        ctx.lineTo(vB.px, vB.py);
        ctx.stroke();
      }

      // Draw Geometry Vertices (Glowing green node connectors)
      for (let i = 0; i < projectedVertices.length; i++) {
        const v = projectedVertices[i];
        const alpha = Math.max(0.15, (v.z + 150) / 300 * 0.7);
        const nodeRadius = Math.max(1.8, 3.2 * v.scale);

        // Node halo
        ctx.beginPath();
        ctx.arc(v.px, v.py, nodeRadius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha * 0.25})`;
        ctx.fill();

        // Node center
        ctx.beginPath();
        ctx.arc(v.px, v.py, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(22, 163, 74, ${alpha})`;
        ctx.fill();
      }

      // --- RENDER FLOATING PARTICLES & CIVIC SYNAPSES ---
      const parallaxFactorX = (mouse.x - cssWidth * 0.5) * 0.02;
      const parallaxFactorY = (mouse.y - cssHeight * 0.5) * 0.02;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
          p.pulsePhase += 0.03;

          // Wrap edges
          if (p.x < -20) p.x = cssWidth + 20;
          if (p.x > cssWidth + 20) p.x = -20;
          if (p.y < -20) p.y = cssHeight + 20;
          if (p.y > cssHeight + 20) p.y = -20;
          if (p.z < -200) p.z = 200;
          if (p.z > 200) p.z = -200;
        }

        // Depth perspective
        const depthScale = cameraDistance / (cameraDistance + p.z + 200);
        const screenX = p.x + parallaxFactorX * (p.z / 100);
        const screenY = p.y + parallaxFactorY * (p.z / 100);
        p.screenX = screenX;
        p.screenY = screenY;
        p.depthScale = depthScale;

        // Render Connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = screenX - (p2.screenX || p2.x);
          const dy = screenY - (p2.screenY || p2.y);
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = p.isMajorNode || p2.isMajorNode ? 140 : 95;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.18 * depthScale;
            ctx.strokeStyle = `rgba(34, 197, 94, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(screenX, screenY);
            ctx.lineTo(p2.screenX || p2.x, p2.screenY || p2.y);
            ctx.stroke();
          }
        }

        // Render Particle Node
        const pulse = Math.sin(p.pulsePhase) * 0.3 + 0.7;
        const currentRadius = p.radius * depthScale * (p.isMajorNode ? 1.4 : 1);
        const alpha = Math.max(0.12, (0.45 * depthScale) * pulse);

        if (p.isMajorNode) {
          // Outer glowing pulse ring
          ctx.beginPath();
          ctx.arc(screenX, screenY, currentRadius * 3.5 * pulse, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${alpha * 0.18})`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(screenX, screenY, currentRadius * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${alpha * 0.4})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(screenX, screenY, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ opacity: 0.95 }}
      />
    </div>
  );
};

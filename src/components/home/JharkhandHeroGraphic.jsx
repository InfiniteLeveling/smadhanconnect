import React, { useState } from 'react';
import { Shield, Sparkles, MapPin, Activity, Cpu, CheckCircle, Radio } from 'lucide-react';

const DISTRICT_NODES = [
  { id: 'ranchi', name: 'Ranchi (HQ)', x: 48, y: 55, activeProblems: 14, tag: 'Nodal Command Center' },
  { id: 'dhanbad', name: 'Dhanbad', x: 74, y: 44, activeProblems: 9, tag: 'Coal Dust & Air Quality' },
  { id: 'jamshedpur', name: 'East Singhbhum', x: 68, y: 78, activeProblems: 11, tag: 'Smart Mobility Corridor' },
  { id: 'bokaro', name: 'Bokaro', x: 64, y: 48, activeProblems: 7, tag: 'Industrial Waste Recirculation' },
  { id: 'hazaribagh', name: 'Hazaribagh', x: 44, y: 38, activeProblems: 6, tag: 'Rural Water Filtration' },
  { id: 'deoghar', name: 'Deoghar', x: 76, y: 26, activeProblems: 8, tag: 'Civic Crowd Telemetry' },
  { id: 'dumka', name: 'Dumka', x: 86, y: 28, activeProblems: 5, tag: 'Tribal Agro-Storage' },
  { id: 'palamu', name: 'Palamu', x: 22, y: 32, activeProblems: 10, tag: 'Fluoride Sensor Grid' },
];

export const JharkhandHeroGraphic = () => {
  const [hoveredNode, setHoveredNode] = useState(DISTRICT_NODES[0]);

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto select-none">
      {/* Ambient Glow Aura */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-brand-300/30 via-emerald-200/20 to-teal-100/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Futuristic Civic Glass Enclosure */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-100/90 shadow-2xl shadow-emerald-950/5 p-6 overflow-hidden">
        
        {/* Top Civic Status Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100/80">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-600"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase font-display">
              Jharkhand Civic Grid
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-50 border border-brand-200/60 rounded-full">
            <Radio className="w-3 h-3 text-brand-600 animate-pulse" />
            <span className="text-[10px] font-bold text-brand-800">24 Districts Live</span>
          </div>
        </div>

        {/* Interactive Map Visual Stage */}
        <div className="relative h-64 sm:h-72 w-full flex items-center justify-center">
          
          {/* Stylized SVG Map of Jharkhand & Civic Grid Connections */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full filter drop-shadow-sm transition-transform duration-700 ease-out"
          >
            <defs>
              {/* Green Hologram Gradient */}
              <linearGradient id="jharkhandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dcfce7" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#bbf7d0" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#f0fdf4" stopOpacity="0.9" />
              </linearGradient>

              {/* District Trail Gradient */}
              <linearGradient id="trailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
              </linearGradient>

              {/* Pulsing Grid Pattern */}
              <pattern id="civicGridPattern" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M 6 0 L 0 0 0 6" fill="none" stroke="#22c55e" strokeWidth="0.25" strokeOpacity="0.18" />
              </pattern>
            </defs>

            {/* Stylized Topographic Boundary of Jharkhand State */}
            <path
              d="M 16 34 Q 24 22 36 24 T 54 18 T 72 20 T 88 24 T 92 38 T 86 52 T 76 68 T 68 86 T 52 82 T 38 88 T 24 78 T 14 62 T 12 44 Z"
              fill="url(#jharkhandGradient)"
              stroke="#16a34a"
              strokeWidth="0.8"
              strokeDasharray="2 1"
              className="transition-all"
            />

            {/* Subtle Civic Grid Texture Overlay */}
            <path
              d="M 16 34 Q 24 22 36 24 T 54 18 T 72 20 T 88 24 T 92 38 T 86 52 T 76 68 T 68 86 T 52 82 T 38 88 T 24 78 T 14 62 T 12 44 Z"
              fill="url(#civicGridPattern)"
            />

            {/* Synaptic Light Trails connecting HQ (Ranchi) to Districts */}
            {DISTRICT_NODES.filter(n => n.id !== 'ranchi').map((node, i) => (
              <g key={`trail-${node.id}`}>
                {/* Background static line */}
                <line
                  x1="48"
                  y1="55"
                  x2={node.x}
                  y2={node.y}
                  stroke="#16a34a"
                  strokeWidth="0.4"
                  strokeOpacity="0.3"
                />
                {/* Animated light pulse line */}
                <line
                  x1="48"
                  y1="55"
                  x2={node.x}
                  y2={node.y}
                  stroke="#22c55e"
                  strokeWidth="0.75"
                  strokeDasharray="3 9"
                  strokeLinecap="round"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              </g>
            ))}

            {/* Inter-District Cross-Mesh */}
            <path
              d="M 22 32 L 44 38 L 74 44 L 76 26 L 86 28 M 74 44 L 68 78 L 48 55 M 22 32 L 48 55"
              fill="none"
              stroke="#059669"
              strokeWidth="0.3"
              strokeOpacity="0.25"
            />

            {/* Stylized Civic Assembly Elevation (Center HQ Silhouette) */}
            <g transform="translate(43, 49) scale(0.12)" opacity="0.65">
              <path
                d="M 10 30 L 40 10 L 70 30 L 70 60 L 10 60 Z M 35 15 L 45 15 L 45 35 L 35 35 Z"
                fill="#15803d"
              />
            </g>

            {/* District Nodes with Glowing Interactive Markers */}
            {DISTRICT_NODES.map((node) => {
              const isSelected = hoveredNode?.id === node.id;
              const isHQ = node.id === 'ranchi';

              return (
                <g
                  key={node.id}
                  className="cursor-pointer transition-transform duration-200 hover:scale-125"
                  onMouseEnter={() => setHoveredNode(node)}
                  onClick={() => setHoveredNode(node)}
                >
                  {/* Outer Pulsing Aura */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHQ ? 4.5 : isSelected ? 3.8 : 2.5}
                    fill={isHQ ? '#16a34a' : '#22c55e'}
                    fillOpacity={isSelected ? 0.4 : 0.2}
                    className={isSelected ? 'animate-ping' : ''}
                  />

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHQ ? 2.6 : isSelected ? 2.2 : 1.6}
                    fill={isHQ ? '#15803d' : '#16a34a'}
                    stroke="#ffffff"
                    strokeWidth="0.6"
                  />

                  {/* Label for Key Nodes */}
                  {(isHQ || isSelected) && (
                    <text
                      x={node.x}
                      y={node.y - 4}
                      textAnchor="middle"
                      fontSize="3.2"
                      fontWeight="700"
                      fill="#0f172a"
                      className="select-none font-sans"
                    >
                      {node.name.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Floating Telemetry Micro-Card */}
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-2xl p-3 border border-emerald-100 shadow-lg flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 font-display">
                  {hoveredNode.name}
                </p>
                <p className="text-[10px] text-brand-700 font-medium truncate max-w-[180px] sm:max-w-[220px]">
                  {hoveredNode.tag}
                </p>
              </div>
            </div>
            <div className="text-right pl-2 border-l border-slate-100">
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                Active Queue
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {hoveredNode.activeProblems} Challenges
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Civic Flow Pathway Metaphor */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-slate-700 font-semibold">
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            Verified Pipeline
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            AI Auto-Triage & IoT
          </span>
        </div>
      </div>
    </div>
  );
};







import React, { useMemo } from 'react';

const VisitGraph = () => {
  // ------------------------------
  // Sample visit data
  // ------------------------------
  const visits = [
    { "visit_id": 1, "visit_time": "2025-09-01T09:00:00Z", "doctor_id": 101 },
    { "visit_id": 2, "visit_time": "2025-09-01T11:30:00Z", "doctor_id": 102 },
    { "visit_id": 3, "visit_time": "2025-09-01T15:15:00Z", "doctor_id": 103 },
    { "visit_id": 4, "visit_time": "2025-09-02T08:45:00Z", "doctor_id": 101 },
    { "visit_id": 5, "visit_time": "2025-09-02T13:20:00Z", "doctor_id": 104 },
    { "visit_id": 6, "visit_time": "2025-09-02T17:10:00Z", "doctor_id": 102 },
    { "visit_id": 7, "visit_time": "2025-09-03T09:30:00Z", "doctor_id": 105 },
    // { "visit_id": 8, "visit_time": "2025-09-03T14:00:00Z", "doctor_id": 106 },
    { "visit_id": 9, "visit_time": "2025-09-04T10:15:00Z", "doctor_id": 103 },
    { "visit_id": 10, "visit_time": "2025-09-04T16:40:00Z", "doctor_id": 104 }
  ];

  // ------------------------------
  // Colors for each doctor/track
  // ------------------------------
  const colors = [
  "#4ADE80", // bright green
  "#A7F3D0", // mint
  "#FACC15", // yellow
  "#60A5FA", // blue
  "#F472B6", // pink
  "#F87171", // red
  "#FBBF24", // orange
];
  // ------------------------------
  // Process visits to assign tracks, colors, and branch connections
  // ------------------------------
  const graphData = useMemo(() => {
    const doctorTracks = new Map(); // track index per doctor
    const processedVisits = [];     // visits with track info
    const branchConnections = [];   // connections between new tracks
    let trackCounter = 0;

    visits.forEach((visit, index) => {
      if (!doctorTracks.has(visit.doctor_id)) {
        // New doctor → assign a track
        if (trackCounter > 0) {
          // Connect previous track to this new track
          const previousTrack = trackCounter - 1;
          branchConnections.push({
            fromTrack: previousTrack,
            fromIndex: index,
            toTrack: trackCounter,
            toIndex: index,
            color: colors[trackCounter % colors.length]
          });
        }

        doctorTracks.set(visit.doctor_id, {
          trackIndex: trackCounter++,
          color: colors[(trackCounter - 1) % colors.length],
          lastVisitIndex: index
        });
      } else {
        // Existing doctor → update last visit index
        doctorTracks.get(visit.doctor_id).lastVisitIndex = index;
      }

      // Add track info to the visit
      processedVisits.push({
        ...visit,
        trackIndex: doctorTracks.get(visit.doctor_id).trackIndex,
        color: doctorTracks.get(visit.doctor_id).color,
        index
      });
    });

    return { processedVisits, totalTracks: trackCounter, branchConnections };
  }, [colors]);

  // ------------------------------
  // Graph dimensions and constants
  // ------------------------------
  const TRACK_WIDTH = 45;     // horizontal distance per track (reduced for sidebar)
  const ROW_HEIGHT = 60;      // vertical distance per row (reduced for sidebar)
  const NODE_RADIUS = 6;      // radius of visit nodes (reduced for sidebar)
  const GRAPH_PADDING = 20;   // padding around SVG (reduced for sidebar)
  const START_OFFSET = 10;    // **offset for Y-axis: curve starts above the node**
  const CURVE_HEIGHT = 12;    // how high the curve bends (less steep)

  const svgWidth = graphData.totalTracks * TRACK_WIDTH + GRAPH_PADDING * 2;
  const svgHeight = visits.length * ROW_HEIGHT + GRAPH_PADDING * 2;

  return (
    <div className="h-full bg-zinc-900 overflow-auto">
      <div className="p-2">
        <div className="bg-zinc-900 rounded-lg p-3 overflow-auto border border-zinc-800">
          <svg width={svgWidth} height={svgHeight} className="bg-zinc-900">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
            </marker>
          </defs>

          {/* ------------------------------
              Grid lines for each row
          ------------------------------ */}
          {visits.map((_, index) => (
            <line
              key={`grid-${index}`}
              x1={GRAPH_PADDING}
              y1={GRAPH_PADDING + index * ROW_HEIGHT}
              x2={svgWidth - GRAPH_PADDING}
              y2={GRAPH_PADDING + index * ROW_HEIGHT}
              stroke="#27272a" // zinc-800
              strokeWidth="1"
              opacity="0.25"
            />
          ))}

          {/* ------------------------------
              Branch connections (new track vs previous track)
              Quadratic curve: one control point
              OFFSET applied: startY and endY are raised by START_OFFSET
          ------------------------------ */}
          {graphData.branchConnections.map((connection, index) => {
            const startX = GRAPH_PADDING + connection.fromTrack * TRACK_WIDTH + TRACK_WIDTH/2;
            const startY = GRAPH_PADDING + connection.fromIndex * ROW_HEIGHT - START_OFFSET - 10;
            const endX = GRAPH_PADDING + connection.toTrack * TRACK_WIDTH + TRACK_WIDTH/2;
            const endY = GRAPH_PADDING + connection.toIndex * ROW_HEIGHT - START_OFFSET;

            const controlX = (startX + endX) / 2;
            const controlY = Math.min(startY, endY) - CURVE_HEIGHT;

            return (
              <path
                key={`branch-${index}`}
                d={`M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`}
                stroke={connection.color}
                strokeWidth="2"
                fill="none"
                opacity="0.7"
                strokeDasharray="2,2"
              />
            );
          })}

          {/* ------------------------------
              Same-doctor connections (between visits of the same doctor)
              Quadratic curve
              OFFSET applied: startY and endY are raised by START_OFFSET
          ------------------------------ */}
          {graphData.processedVisits.map((visit, index) => {
            const nextVisit = graphData.processedVisits.slice(index + 1).find(v => v.doctor_id === visit.doctor_id);
            if (nextVisit) {
              const startX = GRAPH_PADDING + visit.trackIndex * TRACK_WIDTH + TRACK_WIDTH/2;
              const startY = GRAPH_PADDING + index * ROW_HEIGHT - START_OFFSET;
              const endX = GRAPH_PADDING + nextVisit.trackIndex * TRACK_WIDTH + TRACK_WIDTH/2;
              const endY = GRAPH_PADDING + nextVisit.index * ROW_HEIGHT - START_OFFSET;

              const controlX = (startX + endX) / 2;
              const controlY = startY + (endY - startY) / 2 - CURVE_HEIGHT;

              return (
                <path
                  key={`connection-${visit.visit_id}-${nextVisit.visit_id}`}
                  d={`M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`}
                  stroke={visit.color}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.85"
                  markerEnd="url(#arrowhead)"
                />
              );
            }
            return null;
          })}

          {/* ------------------------------
              Visit nodes
          ------------------------------ */}
          {graphData.processedVisits.map((visit, index) => {
            const x = GRAPH_PADDING + visit.trackIndex * TRACK_WIDTH + TRACK_WIDTH/2;
            const y = GRAPH_PADDING + index * ROW_HEIGHT;

            return (
              <g key={visit.visit_id}>
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_RADIUS + 2}
                  fill="#18181b" // zinc-900
                  stroke={visit.color}
                  strokeWidth="3"
                />
                <circle
                  cx={x}
                  cy={y}
                  r={NODE_RADIUS - 2}
                  fill={visit.color}
                />
                <text
                  x={x}
                  y={y + 2}
                  textAnchor="middle"
                  className="text-xs font-bold fill-zinc-200"
                >
                  {visit.visit_id}
                </text>
              </g>
            );
          })}
        </svg>
        </div>

        {/* ------------------------------
            Legend for doctors (compact for sidebar)
        ------------------------------ */}
        <div className="mt-3 bg-zinc-900 rounded-lg p-2 border border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-200 mb-2">Doctors</h3>
          <div className="flex flex-wrap gap-2">
            {[...new Set(visits.map(v => v.doctor_id))].map((doctorId, index) => (
              <div key={doctorId} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full border border-zinc-700"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-zinc-400 text-xs">Dr {doctorId}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitGraph;

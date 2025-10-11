import React, { useMemo, useState } from 'react';

const VisitGraph = ({ visits = [], onVisitContextSet }) => {
  const [hoveredVisit, setHoveredVisit] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle visit click to set context
    const handleVisitClick = (visit, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    if (onVisitContextSet) {
      // Extract visit context information
      const visitContext = {
        visitId: visit.visitId,
        doctorName: visit.doctorName,
        appointmentDate: visit.appointmentDate,
        symptoms: visit.symptoms || [],
        prescription: visit.prescription || [],
        otherInfo: visit.otherInfo || {},
        summary : "You visited Dr. " + visit.doctorName + " on " + visit.appointmentDate + ". Main symptoms were: " + (Array.isArray(visit.symptoms) ? visit.symptoms.join(', ') : visit.symptoms) + ". Prescribed: " + (Array.isArray(visit.prescription) ? visit.prescription.join(', ') : visit.prescription) + "."+
        " Please note that this is a summary and may not include all relevant information."+
                " As a reminder, please follow the prescribed treatment and consult your doctor if symptoms persist or worsen."+
                " For more details, refer to your full medical history in the app."
      };
      
      onVisitContextSet(visitContext);
    }
  };
  // ------------------------------
  // Colors for each doctor/track
  // ------------------------------
  const colors = [
  "#4ADE80", // bright green
  "#A7F3D0", // mint
  "#FACC95", // yellow
  "#60A5FA", // blue
  "#F472B6", // pink
  "#F87171", // red
  "#FBBF24", // orange
  "#C084FC", // purple
  "#34D399", // teal
  "#F9A8D4"  // light pink

];
  // ------------------------------
  // Process visits to assign tracks, colors, and branch connections
  // ------------------------------
  const graphData = useMemo(() => {
    // Handle empty visits case inside useMemo
    if (!visits || visits.length === 0) {
      return { processedVisits: [], totalTracks: 0, branchConnections: [] };
    }
    const doctorTracks = new Map(); // track index per doctor
    const processedVisits = [];     // visits with track info
    const branchConnections = [];   // connections between new tracks
    let trackCounter = 0;

    visits.forEach((visit, index) => {
      // Handle both old format (doctor_id) and new format (doctorId)
      const doctorName = visit.doctorName;
      if (!doctorTracks.has(doctorName)) {
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

        doctorTracks.set(doctorName, {
          trackIndex: trackCounter++,
          color: colors[(trackCounter - 1) % colors.length],
          lastVisitIndex: index
        });
      } else {
        // Existing doctor → update last visit index
        doctorTracks.get(doctorName).lastVisitIndex = index;
      }

      // Add track info to the visit
      processedVisits.push({
        ...visit,
        trackIndex: doctorTracks.get(doctorName).trackIndex,
        color: doctorTracks.get(doctorName).color,
        doctorName: doctorName, // Normalize the doctor ID field
        visitId: visit.visitId || visit.visit_id, // Normalize the visit ID field
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

  // Handle empty visits case
  if (!visits || visits.length === 0) {
    return (
      <div className="text-center text-zinc-400 py-8">
        <p>No visits data available</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-900">
      <div>
        <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800">
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
            const nextVisit = graphData.processedVisits.slice(index + 1).find(v => v.doctorName === visit.doctorName);
            if (nextVisit) {
              const startX = GRAPH_PADDING + visit.trackIndex * TRACK_WIDTH + TRACK_WIDTH/2;
              const startY = GRAPH_PADDING + index * ROW_HEIGHT - START_OFFSET;
              const endX = GRAPH_PADDING + nextVisit.trackIndex * TRACK_WIDTH + TRACK_WIDTH/2;
              const endY = GRAPH_PADDING + nextVisit.index * ROW_HEIGHT - START_OFFSET;

              const controlX = (startX + endX) / 2;
              const controlY = startY + (endY - startY) / 2 - CURVE_HEIGHT;

              return (
                <path
                  key={`connection-${visit.doctorName}-${index}-${nextVisit.index}`}
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
              <g 
                key={visit.visitId} 
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  setHoveredVisit(visit);
                  setMousePosition({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredVisit(null)}
                onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
                onClick={(e) => handleVisitClick(visit, e)}
              >
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
                  {visit.visitId}
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
            {[...new Map(visits.map(v => [v.doctorName])).entries()].map(([ doctorName], index) => (
              <div key={doctorName} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-full border border-zinc-700"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-zinc-400 text-xs">Dr. {doctorName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredVisit && (
        <div 
          className="fixed bg-zinc-800 border border-zinc-600 rounded-lg shadow-lg p-3 pointer-events-none z-50 text-sm"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="space-y-1">
            <div className="font-semibold text-zinc-200">Visit #{hoveredVisit.visitId}</div>
            <div className="text-zinc-300">Dr. {hoveredVisit.doctorName}</div>
            {hoveredVisit.appointmentDate && (
              <div className="text-zinc-400">{hoveredVisit.appointmentDate}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Export as Timeline for better naming consistency
const Timeline = VisitGraph;
export default Timeline;

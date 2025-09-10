  // Speedometer component for health profile cards
  const MiniSpeedometer = ({ value, unit, ranges, size = 80 }) => {
    const numericValue = parseFloat(value) || 0;
    const { min, max } = ranges.scale;
    const percentage = Math.min(Math.max((numericValue - min) / (max - min) * 100, 0), 100);
    
    // Determine color based on ranges
    let color = '#ef4444'; // default red
    let status = 'High';
    if (numericValue >= ranges.green.min && numericValue <= ranges.green.max) {
      color = '#22c55e';
      status = 'Normal';
    } else if (numericValue >= ranges.yellow.min && numericValue <= ranges.yellow.max) {
      color = '#eab308';
      status = 'Caution';
    }
    
    // Calculate positions for range segments
    const radius = size/2 - 10;
    const centerX = size/2;
    const centerY = size/2;
    
    // Helper function to get coordinates on arc
    const getArcPoint = (percentage) => {
      const angle = Math.PI * percentage / 100; // 0 to PI for semicircle
      return {
        x: centerX - radius * Math.cos(angle),
        y: centerY - radius * Math.sin(angle)
      };
    };
    
    // Calculate range percentages
    const greenStartPct = ((ranges.green.min - min) / (max - min)) * 100;
    const greenEndPct = ((ranges.green.max - min) / (max - min)) * 100;
    const yellowStartPct = ((ranges.yellow.min - min) / (max - min)) * 100;
    const yellowEndPct = ((ranges.yellow.max - min) / (max - min)) * 100;
    
    // Get arc points
    const greenStart = getArcPoint(greenStartPct);
    const greenEnd = getArcPoint(greenEndPct);
    const yellowStart = getArcPoint(yellowStartPct);
    const yellowEnd = getArcPoint(yellowEndPct);
    const currentPoint = getArcPoint(percentage);
    
    // Create arc path
    const createArcPath = (start, end, startPct, endPct) => {
      const largeArcFlag = (endPct - startPct) > 50 ? 1 : 0;
      return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
    };
    
    return (
      <div className="w-full flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size/2 + 20 }}>
          <svg width={size} height={size/2 + 20} viewBox={`0 0 ${size} ${size/2 + 20}`}>
            {/* Background arc */}
            <path
              d={`M 10 ${size/2} A ${radius} ${radius} 0 0 1 ${size-10} ${size/2}`}
              fill="none"
              stroke="#374151"
              strokeWidth="8"
              strokeLinecap="round"
            />
            
            {/* Green range segment */}
            <path
              d={createArcPath(greenStart, greenEnd, greenStartPct, greenEndPct)}
              fill="none"
              stroke="#22c55e"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.7"
            />
            
            {/* Yellow range segment */}
            <path
              d={createArcPath(yellowStart, yellowEnd, yellowStartPct, yellowEndPct)}
              fill="none"
              stroke="#eab308"
              strokeWidth="8"
              strokeLinecap="round"
              opacity="0.7"
            />
            
            {/* Current value indicator */}
            <circle
              cx={currentPoint.x}
              cy={currentPoint.y}
              r="6"
              fill={color}
              stroke="#ffffff"
              strokeWidth="2"
            />
            
            {/* Range labels */}
            <text x="15" y={size/2 + 15} fontSize="8" fill="#9ca3af" textAnchor="start">{min}</text>
            <text x={size-15} y={size/2 + 15} fontSize="8" fill="#9ca3af" textAnchor="end">{max}</text>
          </svg>
        </div>
        
        <div className="text-center mt-2">
          <div className="text-lg font-bold" style={{ color }}>{numericValue}</div>
          <div className="text-xs text-gray-400">{unit}</div>
          <div className="text-xs font-medium" style={{ color }}>{status}</div>
        </div>
      </div>
    );
  };

  export { MiniSpeedometer };
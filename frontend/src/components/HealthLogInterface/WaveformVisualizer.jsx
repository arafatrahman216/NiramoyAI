import React from 'react';

/**
 * WaveformVisualizer
 * Lightweight live waveform component using Canvas + AnalyserNode time-domain data.
 * Props:
 *  - analyser: AnalyserNode (required while active)
 *  - width, height: canvas dimensions
 *  - barColor: stroke style
 *  - background: tailwind-compatible class for container background
 */
const WaveformVisualizer = ({ analyser, width = 520, height = 96, barColor = '#10b981', background = 'bg-zinc-900/50' }) => {
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const draw = React.useCallback(() => {
    if (!analyser) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Background gradient
    const grad = ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0,'rgba(16,185,129,0.15)');
    grad.addColorStop(1,'rgba(16,185,129,0.02)');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.lineWidth = 2;
    ctx.strokeStyle = barColor;
    ctx.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0; // 0..255 -> ~0..2
      const y = (v * canvas.height) / 2;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();

    rafRef.current = requestAnimationFrame(draw);
  }, [analyser]);

  React.useEffect(() => {
    if (!analyser) return;
    draw();
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [analyser, draw]);

  return (
    <div className={`rounded-xl border border-zinc-700 overflow-hidden ${background}`}>      
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-24 block"
      />
    </div>
  );
};

export default WaveformVisualizer;

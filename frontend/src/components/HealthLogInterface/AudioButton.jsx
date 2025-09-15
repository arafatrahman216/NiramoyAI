import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import api from '../../services/api';

/**
 * AudioButton
 * Encapsulates voice recording logic + live waveform visualization.
 * Props:
 *  - onUploadSuccess?: (response) => void
 *  - autoStopMs?: number (optional max duration)
 *  - enableUpload?: boolean (default true) to control whether to POST audio
 */
const AudioButton = ({ onUploadSuccess, autoStopMs = 0, enableUpload = true }) => {
  const [isRecording, setIsRecording] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [elapsedMs, setElapsedMs] = React.useState(0);
  const timerRef = React.useRef(null);
  const autoStopRef = React.useRef(null);
  const mediaRecorderRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const audioContextRef = React.useRef(null);
  const analyserRef = React.useRef(null);

  // Waveform drawing
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(null);

  const formatElapsed = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2,'0');
    const s = (totalSec % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  };

  const startTimer = () => {
    const start = Date.now();
    timerRef.current = setInterval(() => setElapsedMs(Date.now() - start), 250);
  };
  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  const draw = React.useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const grad = ctx.createLinearGradient(0,0,0,canvas.height);
    grad.addColorStop(0,'rgba(220,38,38,0.15)');
    grad.addColorStop(1,'rgba(220,38,38,0.02)');
    ctx.fillStyle = grad; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.lineWidth = 2; ctx.strokeStyle = isRecording ? '#ef4444' : '#10b981';
    ctx.beginPath();
    const sliceWidth = canvas.width / bufferLength; let x = 0;
    for (let i=0;i<bufferLength;i++) {
      const v = dataArray[i] / 128; const y = (v * canvas.height)/2;
      if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      x += sliceWidth;
    }
    ctx.stroke();
    rafRef.current = requestAnimationFrame(draw);
  }, [isRecording]);

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      analyserRef.current.smoothingTimeConstant = 0.85;
      source.connect(analyserRef.current);
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = e => { if (e.data && e.data.size>0) chunksRef.current.push(e.data); };
      mr.onstop = handleRecordingStop;
      mr.start();
      mediaRecorderRef.current = mr;
      setElapsedMs(0); startTimer(); setIsRecording(true);
      // start waveform loop
      draw();
      if (autoStopMs > 0) {
        autoStopRef.current = setTimeout(() => { stopRecording(); }, autoStopMs);
      }
    } catch (e) {
      console.error('Mic permission / start error', e);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    setIsRecording(false);
    stopTimer();
    if (autoStopRef.current) { clearTimeout(autoStopRef.current); autoStopRef.current = null; }
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) { audioContextRef.current.close(); audioContextRef.current = null; }
    analyserRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const handleRecordingToggle = () => { if (isProcessing) return; isRecording ? stopRecording() : startRecording(); };

  const handleRecordingStop = async () => {
    try {
      setIsProcessing(true);
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      if (enableUpload) {
        const fd = new FormData(); fd.append('audio', blob, 'recording.webm');
        try {
          const res = await api.post('/user/audio', fd);
          if (onUploadSuccess) onUploadSuccess(res.data);
        } catch (uploadErr) {
          console.error('Upload failed:', uploadErr);
        }
      }
      await api.get('/user/test');
      console.log('Recording finished. Blob size:', blob.size);
    } catch (err) {
      console.error('Processing error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) audioContextRef.current.close();
      stopTimer();
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className={`relative flex items-center transition-all duration-500 ${isRecording ? 'pr-2' : 'justify-center'}`}>
        {/* Waveform area (appears when recording) */}
        <div className={`transition-all duration-500 overflow-hidden ${isRecording ? 'flex-1 mr-4 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4'} `}>
          <div className="h-16 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800/80 relative flex items-center px-3">
            <canvas ref={canvasRef} width={800} height={64} className="w-full h-16 block mix-blend-screen" />
            {/* Subtle overlay grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.15] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          </div>
          <div className="mt-2 flex items-center text-xs text-red-400 tracking-wider font-medium gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording {formatElapsed(elapsedMs)}
          </div>
        </div>
        {/* Circular Button */}
        <button
          type="button"
          onClick={handleRecordingToggle}
            disabled={isProcessing}
          className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none
            ${isRecording ? 'w-20 h-20 bg-red-600/20 border border-red-500/40 shadow-[0_0_0_4px_rgba(220,38,38,0.25)] hover:bg-red-600/30' : 'w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 hover:from-zinc-700 hover:to-zinc-800'}
            ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isRecording && <span className="absolute inset-0 rounded-full bg-red-500/10 animate-ping" />}
          <span className="relative flex flex-col items-center text-zinc-200 text-xs font-medium">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
            ) : isRecording ? (
              <>
                <MicOff className="w-9 h-9 text-red-400" />
                <span className="mt-1 text-[11px] uppercase tracking-wide">Stop</span>
              </>
            ) : (
              <>
                <Mic className="w-10 h-10 text-emerald-400" />
                <span className="mt-1 text-[11px] uppercase tracking-wide">Record</span>
              </>
            )}
          </span>
          {/* sheen */}
          {!isRecording && !isProcessing && (
            <span className="pointer-events-none absolute -left-10 top-0 h-full w-10 translate-x-0 skew-x-[-15deg] bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 hover:opacity-100 hover:translate-x-[260%] transition-all duration-[1400ms]" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AudioButton;

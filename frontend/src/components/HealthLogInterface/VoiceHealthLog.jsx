// ==============================================
// VOICE HEALTH LOG COMPONENT
// ==============================================
// Minimalistic voice-based health logging interface
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Edit3, Sparkles, Info, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const VoiceHealthLog = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [status, setStatus] = useState('idle'); // idle, recording, processing, success, error
  const [elapsedMs, setElapsedMs] = useState(0);
  
  const textareaRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Format elapsed time
  const formatElapsed = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
    const s = (totalSec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Timer functions
  const startTimer = () => {
    const start = Date.now();
    timerRef.current = setInterval(() => setElapsedMs(Date.now() - start), 100);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [transcribedText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) audioContextRef.current.close();
      stopTimer();
    };
  }, []);

  // Start recording
  const startRecording = async () => {
    if (isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;
      analyserRef.current.smoothingTimeConstant = 0.85;
      source.connect(analyserRef.current);

      // Setup media recorder
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mr.onstop = handleRecordingStop;
      mr.start();
      
      mediaRecorderRef.current = mr;
      setElapsedMs(0);
      startTimer();
      setIsRecording(true);
      setStatus('recording');
      setTranscribedText('');
      
      console.log('Started recording...');
    } catch (e) {
      console.error('Microphone access error:', e);
      alert('Unable to access microphone. Please check permissions.');
      setStatus('error');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (!isRecording || !mediaRecorderRef.current) return;
    
    setIsRecording(false);
    stopTimer();
    
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
  };

  // Handle recording stop and upload
  const handleRecordingStop = async () => {
    try {
      setIsProcessing(true);
      setStatus('processing');
      
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      console.log('Recording finished. Blob size:', blob.size);
      
      // Upload to API
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      
      try {
        const response = await api.post('/user/audio', formData);
        console.log('API Response:', response.data);
        
        // Log transcribe and healthLogRecord
        if (response.data.text ) {
          console.log('Transcribe:', response.data.text);
          setTranscribedText(response.data.text);
        }
        
        setStatus('success');
      } catch (uploadErr) {
        console.error('Upload failed:', uploadErr);
        setStatus('error');
        alert('Failed to process audio. Please try again.');
      }
    } catch (err) {
      console.error('Processing error:', err);
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Toggle recording
  const handleVoiceRecord = () => {
    if (isProcessing) return;
    isRecording ? stopRecording() : startRecording();
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!transcribedText.trim()) {
      setStatus('error');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Submitting health log:', transcribedText);
      
      // Send text to /text-log endpoint
      const response = await api.post('/user/text-log', transcribedText, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });
      
      console.log('Text Log API Response:', response.data);
      
      if (response.data.healthLogRecord) {
        console.log('Health Log Record:', response.data.healthLogRecord);
      }
      
      setStatus('success');
      setIsProcessing(false);
      
      // Show success message briefly then navigate
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Failed to submit health log:', error);
      setStatus('error');
      setIsProcessing(false);
      alert('Failed to submit health log. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header with Fill Form Button */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-light text-white mb-2">
              {t('voiceHealthLog.title')}
            </h1>
            <p className="text-zinc-400">
              {t('voiceHealthLog.subtitle')}
            </p>
          </div>
          
          {/* Fill Form Instead Button */}
          <button
            onClick={() => navigate('/healthlog/form')}
            className="bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 border border-zinc-700 hover:border-zinc-600 flex items-center space-x-2 text-sm"
          >
            <Edit3 className="w-4 h-4" />
            <span>{t('voiceHealthLog.fillFormInstead')}</span>
          </button>
        </div>

        {/* Instructions Section - Matching screenshot design */}
        <div className="mb-8 bg-gradient-to-r from-zinc-900/40 to-zinc-800/40 border border-zinc-700/50 rounded-xl p-5">
          <h2 className="text-base font-medium text-zinc-200 mb-3 flex items-center">
            <Info className="w-4 h-4 mr-2 text-blue-400" />
            {t('voiceHealthLog.tipsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-400">
            <div className="space-y-1.5">
              <p>
                <strong className="text-zinc-300">{t('voiceHealthLog.bloodPressureLabel')}</strong> {t('voiceHealthLog.bloodPressureDesc')}
              </p>
              <p>
                <strong className="text-zinc-300">{t('voiceHealthLog.heartRateLabel')}</strong> {t('voiceHealthLog.heartRateDesc')}
              </p>
              <p>
                <strong className="text-zinc-300">{t('voiceHealthLog.temperatureLabel')}</strong> {t('voiceHealthLog.temperatureDesc')}
              </p>
              <p>
                <strong className="text-zinc-300">{t('voiceHealthLog.bloodSugarLabel')}</strong> {t('voiceHealthLog.bloodSugarDesc')}
              </p>
            </div>
            <div className="space-y-1.5">
              <p>
                <strong className="text-zinc-300">{t('voiceHealthLog.weightLabel')}</strong> {t('voiceHealthLog.weightDesc')}
              </p>
              <p>
                <strong className="text-zinc-300">{t('voiceHealthLog.symptomsLabel')}</strong> {t('voiceHealthLog.symptomsDesc')}
              </p>
              <p>
                <strong className="text-zinc-300">{t('voiceHealthLog.medicationsLabel')}</strong> {t('voiceHealthLog.medicationsDesc')}
              </p>
              <p>
                <strong className="text-zinc-300">{t('voiceHealthLog.notesLabel')}</strong> {t('voiceHealthLog.notesDesc')}
              </p>
            </div>
          </div>
          
          {/* Example Note */}
          <div className="mt-4 pt-4 border-t border-zinc-700/50">
            <h3 className="text-xs font-medium text-zinc-300 mb-2">{t('voiceHealthLog.exampleNoteLabel')}</h3>
            <p className="text-xs text-zinc-500 italic leading-relaxed">
              {t('voiceHealthLog.exampleNote')}
            </p>
          </div>
        </div>

        {/* Voice Recording Button */}
        <div className="mb-8">
          <div className="relative flex items-center justify-center">
            {/* Professional Recording Button */}
            <button
              onClick={handleVoiceRecord}
              disabled={isProcessing}
              className={`
                relative group transition-all duration-300
                ${isRecording ? 'scale-105' : 'scale-100 hover:scale-[1.03]'}
                ${isProcessing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {/* Outer glow ring (subtle, animated when recording) */}
              <div className={`
                absolute inset-0 rounded-full transition-all duration-300
                ${isRecording 
                  ? 'bg-red-500/25 blur-xl scale-125 animate-pulse' 
                  : 'bg-blue-500/20 blur-lg scale-110 opacity-0 group-hover:opacity-100'
                }
              `} />
              
              {/* Main button circle */}
              <div className={`
                relative rounded-full transition-all duration-300
                ${isRecording 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30' 
                  : 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40'
                }
                w-20 h-20 flex items-center justify-center
              `}>
                {/* Icon */}
                {isProcessing ? (
                  <Loader className="w-8 h-8 text-white animate-spin" />
                ) : isRecording ? (
                  <div className="relative">
                    <MicOff className="w-8 h-8 text-white" />
                    {/* Subtle pulse */}
                    <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                  </div>
                ) : (
                  <Mic className="w-8 h-8 text-white transition-transform group-hover:scale-110" />
                )}
              </div>
              
              {/* Shimmer effect on idle */}
              {!isRecording && !isProcessing && (
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </div>
              )}
            </button>
            
            {/* Recording indicator and timer */}
            {isRecording && (
              <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 flex items-center space-x-1.5 text-red-400 bg-zinc-900/90 border border-red-500/30 rounded-full px-3 py-1 backdrop-blur-sm animate-fade-in">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium tracking-wide">
                  {formatElapsed(elapsedMs)}
                </span>
              </div>
            )}
          </div>
          
          {/* Status text */}
          <div className="text-center mt-10">
            <p className={`
              text-base font-medium transition-colors duration-300
              ${isRecording ? 'text-red-400' : isProcessing ? 'text-blue-400' : 'text-zinc-300'}
            `}>
              {isProcessing 
                ? t('voiceHealthLog.processingMessage')
                : isRecording 
                  ? t('voiceHealthLog.recordingActive')
                  : t('voiceHealthLog.recordingStart')
              }
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {isProcessing 
                ? t('voiceHealthLog.processingHint')
                : isRecording 
                  ? t('voiceHealthLog.recordingStatus')
                  : t('voiceHealthLog.recordingHint')
              }
            </p>
          </div>
        </div>

        {/* Transcribed Text Box */}
        <div className="mb-6">
          <label className="block text-zinc-300 mb-3 text-sm font-medium">
            {t('voiceHealthLog.yourHealthLog')}
            {transcribedText && (
              <span className="ml-2 text-xs text-zinc-500">
                ({transcribedText.length} {t('voiceHealthLog.characters')})
              </span>
            )}
          </label>
          
          <textarea
            ref={textareaRef}
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            placeholder={t('voiceHealthLog.placeholder')}
            rows={6}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-4 text-white placeholder-zinc-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all resize-none custom-scrollbar"
          />
          
          {/* Submit Button - Below text box, aligned to the right */}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleSubmit}
              disabled={!transcribedText.trim() || isProcessing}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 disabled:from-zinc-700 disabled:to-zinc-600 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 hover:scale-[1.02] disabled:hover:scale-100 shadow-md disabled:shadow-none text-sm"
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <Loader className="w-4 h-4 mr-1.5 animate-spin" />
                  {t('voiceHealthLog.processing')}
                </span>
              ) : (
                t('voiceHealthLog.submit')
              )}
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {status === 'success' && transcribedText && (
          <div className="mb-6 flex items-center space-x-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{t('voiceHealthLog.successMessage')}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{t('voiceHealthLog.errorMessage')}</p>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes ping-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #27272a;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #52525b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }
      `}</style>
    </div>
  );
};

export default VoiceHealthLog;

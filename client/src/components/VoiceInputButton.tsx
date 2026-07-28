import React, { useState, useEffect, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  id?: string;
}

export default function VoiceInputButton({
  onTranscript,
  className = '',
  id = 'voice-input-btn',
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptSegment = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentTranscript += transcriptSegment + ' ';
        }
      }
      if (currentTranscript.trim()) {
        onTranscript(currentTranscript);
      }
    };

    rec.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    setRecognition(rec);
  }, [onTranscript]);

  const toggleListening = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!recognition) return;

      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        try {
          recognition.start();
          setIsListening(true);
        } catch (err) {
          console.warn('Failed to start speech recognition:', err);
        }
      }
    },
    [isListening, recognition]
  );

  if (!isSupported) {
    return null; // Graceful fallback for browsers without Web Speech API
  }

  return (
    <button
      type="button"
      id={id}
      onClick={toggleListening}
      title={isListening ? 'Click to stop listening' : 'Click to speak (Voice-to-Text)'}
      className={`p-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
        isListening
          ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20'
          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
      } ${className}`}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-wider pr-1">Listening…</span>
        </>
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}

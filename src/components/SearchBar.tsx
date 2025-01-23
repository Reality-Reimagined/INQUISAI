import React, { useState, useRef } from 'react';
import { Search, Loader2, Focus, Paperclip, Mic } from 'lucide-react';
import { cn } from '../utils/cn';
import { transcribeAudio } from '../services/speechToText';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  placeholder = "Ask anything..." 
}) => {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      setTranscriptionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/m4a' });
        try {
          const text = await transcribeAudio(audioBlob);
          setQuery(text);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        } catch (error) {
          setTranscriptionError('Failed to transcribe audio. Please try again.');
          console.error('Transcription error:', error);
        } finally {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      setTranscriptionError('Could not access microphone. Please check permissions.');
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <textarea
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-3 pr-32 text-base rounded-xl",
            "bg-white dark:bg-gray-800",
            "border border-gray-200 dark:border-gray-700",
            "text-gray-900 dark:text-gray-100",
            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
            "focus:border-[#0A85D1] focus:ring-1 focus:ring-[#0A85D1]",
            "resize-none overflow-hidden min-h-[56px]",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-gray-500",
            (isLoading || isRecording) && "opacity-70"
          )}
          rows={1}
          disabled={isLoading || isRecording}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Focus className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isRecording 
                ? "text-red-500 hover:text-red-600" 
                : "text-gray-400 hover:text-gray-600",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            <Mic className={cn("w-4 h-4", isRecording && "animate-pulse")} />
          </button>
          <button
            type="submit"
            disabled={isLoading || isRecording}
            className={cn(
              "p-1.5 rounded-lg bg-[#0A85D1] text-white",
              "hover:bg-[#0972B5] transition-colors",
              (isLoading || isRecording) && "cursor-not-allowed opacity-70"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      {transcriptionError && (
        <div className="mt-2 text-sm text-red-500">
          {transcriptionError}
        </div>
      )}
    </form>
  );
};
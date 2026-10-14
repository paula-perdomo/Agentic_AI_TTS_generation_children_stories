import React from 'react';
import { X, Play, Pause, Download, Moon, Sun, Sparkles } from 'lucide-react';

interface FocusReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  storyText: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  voiceName: string;
  language: 'en' | 'es';
  onDownloadMp3: () => void;
  isDownloading: boolean;
  hasAudio: boolean;
  isBedtimeMode: boolean;
  setIsBedtimeMode: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const FocusReaderModal: React.FC<FocusReaderModalProps> = ({
  isOpen,
  onClose,
  title,
  storyText,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  voiceName,
  language,
  onDownloadMp3,
  isDownloading,
  hasAudio,
  isBedtimeMode,
  setIsBedtimeMode,
}) => {
  if (!isOpen) return null;

  // Split story into readable paragraphs
  const paragraphs = storyText.split(/\n\s*\n/).filter((p) => p.trim());

  // Approximate paragraph index based on currentTime / duration
  const activeParagraphIndex =
    duration > 0 && paragraphs.length > 0
      ? Math.min(paragraphs.length - 1, Math.floor((currentTime / duration) * paragraphs.length))
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FDFBF7] dark:bg-[#151311] text-stone-900 dark:text-stone-100 overflow-y-auto transition-colors duration-300">
      
      {/* Top Reading Bar */}
      <div className="sticky top-0 z-10 w-full px-6 py-4 flex items-center justify-between border-b border-amber-900/10 dark:border-amber-100/10 bg-[#FDFBF7]/90 dark:bg-[#151311]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-serif text-sm font-semibold tracking-tight text-amber-900 dark:text-amber-200">
            {language === 'es' ? 'Modo Lectura Tranquila' : 'Bedtime Reading Sanctum'}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            · {voiceName}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBedtimeMode((prev) => !prev)}
            className="p-2 rounded-lg text-stone-600 dark:text-amber-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Toggle day/night reading paper"
          >
            {isBedtimeMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title="Exit focus mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Story Manuscript Center Pane */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 flex flex-col items-center">
        <div className="w-full text-center mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 uppercase tracking-widest font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Cuento Infantil' : "Children's Bedtime Story"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-amber-950 dark:text-amber-100 leading-tight">
            {title || (language === 'es' ? 'Cuento Sin Título' : 'Untitled Story')}
          </h1>
        </div>

        {/* Story Paragraphs with reading highlight */}
        <div className="w-full flex flex-col gap-6 text-lg sm:text-xl font-serif leading-relaxed text-stone-800 dark:text-stone-200">
          {paragraphs.map((p, idx) => {
            const isCurrent = isPlaying && idx === activeParagraphIndex;
            return (
              <p
                key={idx}
                className={`transition-all duration-300 p-3 rounded-xl ${
                  isCurrent
                    ? 'bg-amber-100/60 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-300/60 dark:ring-amber-700/60'
                    : 'opacity-90'
                }`}
              >
                {p}
              </p>
            );
          })}
        </div>
      </main>

      {/* Floating Reader Audio Controls */}
      <div className="sticky bottom-0 z-10 w-full py-4 px-6 border-t border-amber-900/10 dark:border-amber-100/10 bg-[#FDFBF7]/95 dark:bg-[#151311]/95 backdrop-blur-md flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onTogglePlay}
            disabled={!hasAudio}
            className="w-11 h-11 rounded-full bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95 disabled:opacity-40 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>
          <span className="text-xs font-serif text-stone-600 dark:text-stone-400">
            {hasAudio
              ? isPlaying
                ? language === 'es'
                  ? 'Narrando suavemente...'
                  : 'Narrating bedtime tale...'
                : language === 'es'
                ? 'Pausado'
                : 'Paused'
              : language === 'es'
              ? 'Genera el audio en el taller primero'
              : 'Synthesize audio in the workshop first'}
          </span>
        </div>

        {hasAudio && (
          <button
            onClick={onDownloadMp3}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Encoding MP3...' : 'Download MP3'}</span>
          </button>
        )}
      </div>

    </div>
  );
};

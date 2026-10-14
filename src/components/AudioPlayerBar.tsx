import React from 'react';
import { Play, Pause, RotateCcw, RotateCw, Download, Volume2, Sparkles, Check } from 'lucide-react';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  speed: number;
  pitch: number;
  voiceName: string;
  language: 'en' | 'es';
  onDownloadMp3: () => void;
  isDownloading: boolean;
  downloadSuccess: boolean;
  storyTitle: string;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  speed,
  pitch,
  voiceName,
  language,
  onDownloadMp3,
  isDownloading,
  downloadSuccess,
  storyTitle,
}) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#FDFBF7]/95 dark:bg-[#1A1816]/95 border-t border-amber-900/10 dark:border-amber-100/10 backdrop-blur-md px-4 sm:px-6 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Story & Voice Summary Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="w-9 h-9 rounded-full bg-amber-700/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-800 dark:text-amber-400 shrink-0">
            <Volume2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm truncate max-w-[200px] sm:max-w-[280px]">
              {storyTitle || (language === 'es' ? 'Cuento Infantil' : 'Children Story')}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400">
              <span className="font-medium text-amber-800 dark:text-amber-300">{voiceName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{speed.toFixed(2)}x</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{pitch > 0 ? `+${pitch}` : pitch} st</span>
            </div>
          </div>
        </div>

        {/* Center: Playback Controls & Progress Bar */}
        <div className="flex flex-col items-center gap-1.5 w-full max-w-md">
          {/* Main Transport Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSeek(Math.max(0, currentTime - 5))}
              className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Rewind 5 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="w-10 h-10 rounded-full bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onSeek(Math.min(duration, currentTime + 5))}
              className="p-1.5 rounded-full text-stone-600 dark:text-stone-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Fast forward 5 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="w-full flex items-center gap-2 text-[11px] font-mono text-stone-500 dark:text-stone-400 tabular-nums">
            <span className="w-8 text-right">{formatTime(currentTime)}</span>
            
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 1}
                step="0.1"
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg accent-amber-700 dark:accent-amber-500 cursor-pointer"
              />
            </div>

            <span className="w-8 text-left">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Prominent Download MP3 Button */}
        <div className="w-full sm:w-auto flex justify-end">
          <button
            type="button"
            onClick={onDownloadMp3}
            disabled={isDownloading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
            title="Export and download as MP3 with speed and pitch adjustments"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>{language === 'es' ? '¡MP3 Guardado!' : 'MP3 Saved!'}</span>
              </>
            ) : isDownloading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{language === 'es' ? 'Codificando MP3...' : 'Encoding MP3...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="font-bold">{language === 'es' ? 'Descargar MP3' : 'Download MP3'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

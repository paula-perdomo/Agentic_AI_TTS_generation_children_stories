import React from 'react';
import { BookOpen, Moon, Sun, Sparkles, SlidersHorizontal, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'workshop' | 'collection' | 'audition';
  setActiveTab: (tab: 'workshop' | 'collection' | 'audition') => void;
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;
  isBedtimeMode: boolean;
  setIsBedtimeMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
  hasAudio: boolean;
  onDownloadMp3: () => void;
  isDownloading: boolean;
  storyCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  isBedtimeMode,
  setIsBedtimeMode,
  setIsFocusMode,
  hasAudio,
  onDownloadMp3,
  isDownloading,
  storyCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b transition-colors duration-200 bg-[#FDFBF7]/90 dark:bg-[#1A1816]/90 backdrop-blur-md border-amber-900/10 dark:border-amber-100/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-amber-700/10 dark:bg-amber-400/10 flex items-center justify-center text-amber-800 dark:text-amber-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-amber-950 dark:text-amber-50 whitespace-nowrap">
            Cadence
          </span>
          <span className="hidden sm:inline text-xs text-amber-800/60 dark:text-amber-200/50">
            · {language === 'es' ? 'Audio para Cuentos Infantiles' : "Children's Storybook TTS"}
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
          <button
            onClick={() => setActiveTab('workshop')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'workshop'
                ? 'bg-amber-800/10 text-amber-950 dark:bg-amber-100/10 dark:text-amber-100 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            {language === 'es' ? 'Taller de Cuentos' : 'Story Workshop'}
          </button>

          <button
            onClick={() => setActiveTab('collection')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'collection'
                ? 'bg-amber-800/10 text-amber-950 dark:bg-amber-100/10 dark:text-amber-100 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <span>{language === 'es' ? 'Lista de Cuentos' : 'Stories List'}</span>
            {storyCount > 0 && (
              <span className="text-[10px] font-mono font-bold bg-amber-800/15 dark:bg-amber-100/20 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded-full">
                {storyCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('audition')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'audition'
                ? 'bg-amber-800/10 text-amber-950 dark:bg-amber-100/10 dark:text-amber-100 font-semibold'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Audición y Calidad' : 'Audition & Quality'}</span>
          </button>

          <button
            onClick={() => setIsFocusMode(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition-colors whitespace-nowrap"
            title="Open distraction-free reading focus mode"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{language === 'es' ? 'Modo Lectura' : 'Focus Reader'}</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center p-0.5 rounded-lg bg-stone-200/60 dark:bg-stone-800/70 text-xs font-medium">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                language === 'en'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                language === 'es'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              ES
            </button>
          </div>

          {/* Bedtime / Theme Toggle */}
          <button
            onClick={() => setIsBedtimeMode((prev) => !prev)}
            aria-label="Toggle bedtime dark mode"
            className="p-2 rounded-lg text-stone-600 dark:text-amber-300 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
            title={isBedtimeMode ? 'Switch to daylight paper' : 'Switch to bedtime night mode'}
          >
            {isBedtimeMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Prominent Download MP3 Button (when audio is generated) */}
          {hasAudio && (
            <button
              onClick={onDownloadMp3}
              disabled={isDownloading}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Encoding MP3...' : 'Download MP3'}</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

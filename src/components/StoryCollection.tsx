import React, { useState } from 'react';
import { VOICES } from '../data/voices';
import {
  BookOpen,
  Plus,
  UploadCloud,
  Play,
  Pause,
  Download,
  Loader2,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface StoryItem {
  id: string;
  title: string;
  text: string;
  language: 'en' | 'es';
  voiceId: string;
  speed: number;
  pitch: number;
  audioBuffer: AudioBuffer | null;
  audioBase64?: string;
  isGenerating?: boolean;
  error?: string | null;
}

interface StoryCollectionProps {
  stories: StoryItem[];
  currentStoryId: string;
  onSelectStory: (id: string) => void;
  onUpdateStoryVoice: (id: string, voiceId: string) => void;
  onDeleteStory: (id: string) => void;
  onOpenBatchImport: () => void;
  onAddNewStory: () => void;
  onGenerateSingleAudio: (id: string) => void;
  onGenerateAllPending: () => void;
  isBatchGenerating: boolean;
  batchProgress: { current: number; total: number } | null;
  onDownloadStoryMp3: (story: StoryItem) => void;
  isDownloading: boolean;
  activePlayingId: string | null;
  onTogglePlayStory: (story: StoryItem) => void;
  language: 'en' | 'es';
  onNavigateToWorkshop: () => void;
}

export const StoryCollection: React.FC<StoryCollectionProps> = ({
  stories,
  currentStoryId,
  onSelectStory,
  onUpdateStoryVoice,
  onDeleteStory,
  onOpenBatchImport,
  onAddNewStory,
  onGenerateSingleAudio,
  onGenerateAllPending,
  isBatchGenerating,
  batchProgress,
  onDownloadStoryMp3,
  isDownloading,
  activePlayingId,
  onTogglePlayStory,
  language,
  onNavigateToWorkshop,
}) => {
  const [filterLang, setFilterLang] = useState<'all' | 'en' | 'es'>('all');

  const filteredStories = stories.filter((s) => {
    if (filterLang === 'all') return true;
    return s.language === filterLang;
  });

  const generatedCount = stories.filter((s) => s.audioBuffer !== null).length;
  const pendingCount = stories.length - generatedCount;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-28">
      
      {/* Top Banner & Batch Actions */}
      <div className="p-6 rounded-2xl bg-[#F7F3EC] dark:bg-[#201D1A] border border-amber-900/10 dark:border-amber-100/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
              {language === 'es' ? 'Colección de Cuentos Infantiles' : 'Stories Collection & Batch Studio'}
            </h2>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-xl leading-relaxed">
            {language === 'es'
              ? 'Administra tu lista completa de cuentos, importa varios a la vez y genera narraciones en lote con descarga en MP3.'
              : 'Manage your story list, import multiple stories at once, and batch-generate soft children’s audiobooks.'}
          </p>

          <div className="flex items-center gap-3 mt-3 text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
            <span>{stories.length} {language === 'es' ? 'cuentos en total' : 'stories in library'}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              {generatedCount} {language === 'es' ? 'listos en audio' : 'audio ready'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{pendingCount} {language === 'es' ? 'pendientes' : 'pending'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenBatchImport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-950 dark:text-amber-100 bg-amber-100/80 dark:bg-amber-950/50 hover:bg-amber-200/80 rounded-xl border border-amber-300/40 dark:border-amber-800/40 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>{language === 'es' ? 'Importar Lista' : 'Import Stories List'}</span>
          </button>

          <button
            type="button"
            onClick={onAddNewStory}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white/80 dark:bg-stone-900/60 hover:bg-white rounded-xl border border-stone-200 dark:border-stone-800 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'es' ? 'Nuevo Cuento' : 'Add Story'}</span>
          </button>

          <button
            type="button"
            onClick={onGenerateAllPending}
            disabled={isBatchGenerating || pendingCount === 0}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isBatchGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>
                  {batchProgress
                    ? `${language === 'es' ? 'Generando' : 'Generating'} ${batchProgress.current}/${batchProgress.total}...`
                    : language === 'es'
                    ? 'Procesando lote...'
                    : 'Processing batch...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === 'es'
                    ? `Generar Todo (${pendingCount})`
                    : `Generate All Pending (${pendingCount})`}
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between text-xs border-b border-amber-900/10 dark:border-amber-100/10 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-stone-500">{language === 'es' ? 'Filtrar:' : 'Filter:'}</span>
          <div className="flex items-center p-0.5 rounded-lg bg-stone-200/60 dark:bg-stone-800">
            <button
              onClick={() => setFilterLang('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterLang === 'all'
                  ? 'bg-white dark:bg-stone-700 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              {language === 'es' ? 'Todos' : 'All'} ({stories.length})
            </button>
            <button
              onClick={() => setFilterLang('en')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterLang === 'en'
                  ? 'bg-white dark:bg-stone-700 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              English ({stories.filter((s) => s.language === 'en').length})
            </button>
            <button
              onClick={() => setFilterLang('es')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterLang === 'es'
                  ? 'bg-white dark:bg-stone-700 font-semibold shadow-xs'
                  : 'text-stone-600 dark:text-stone-400'
              }`}
            >
              Español ({stories.filter((s) => s.language === 'es').length})
            </button>
          </div>
        </div>
      </div>

      {/* Stories Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStories.map((story) => {
          const isSelected = story.id === currentStoryId;
          const hasAudio = story.audioBuffer !== null;
          const isPlayingThis = activePlayingId === story.id;
          const wordCount = story.text.trim() ? story.text.trim().split(/\s+/).length : 0;
          const estMin = Math.max(0.5, Math.round((wordCount / 125) * 10) / 10);

          return (
            <div
              key={story.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                isSelected
                  ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500/60 shadow-xs ring-1 ring-amber-500/20'
                  : 'bg-white/70 dark:bg-[#1E1B18] border-stone-200/70 dark:border-stone-800/80 hover:border-amber-400/50'
              }`}
            >
              <div>
                {/* Header: Title + Language & Audio Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-800 dark:text-amber-400 bg-amber-100/60 dark:bg-amber-950/60 px-1.5 py-0.5 rounded">
                        {story.language.toUpperCase()}
                      </span>
                      <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base truncate">
                        {story.title}
                      </h3>
                    </div>
                  </div>

                  {/* Audio Status indicator */}
                  <div>
                    {hasAudio ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{language === 'es' ? 'Audio Listo' : 'Audio Ready'}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400">
                        {language === 'es' ? 'Sin audio' : 'Not generated'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Story excerpt */}
                <p className="mt-2 text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                  {story.text}
                </p>

                {/* Metadata & Voice Configuration */}
                <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 text-[11px]">
                      {language === 'es' ? 'Voz:' : 'Voice:'}
                    </span>
                    <select
                      value={story.voiceId}
                      onChange={(e) => onUpdateStoryVoice(story.id, e.target.value)}
                      className="text-xs font-semibold bg-white/80 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2 py-0.5 text-stone-900 dark:text-stone-100"
                    >
                      {VOICES.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.characterTitle.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono tabular-nums">
                    <span>{wordCount} {language === 'es' ? 'palabras' : 'words'}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{estMin} min
                    </span>
                  </div>
                </div>
              </div>

              {/* Story Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200/60 dark:border-stone-800">
                <div className="flex items-center gap-1.5">
                  {/* Play / Pause if generated */}
                  {hasAudio && (
                    <button
                      type="button"
                      onClick={() => onTogglePlayStory(story)}
                      className="p-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white transition-colors cursor-pointer"
                      title={isPlayingThis ? 'Pause' : 'Play audio'}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </button>
                  )}

                  {/* Prominent Download MP3 Button */}
                  {hasAudio && (
                    <button
                      type="button"
                      onClick={() => onDownloadStoryMp3(story)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      title="Download story as playable MP3 file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'es' ? 'Descargar MP3' : 'Download MP3'}</span>
                    </button>
                  )}

                  {/* Generate Button if not yet generated */}
                  {!hasAudio && (
                    <button
                      type="button"
                      onClick={() => onGenerateSingleAudio(story.id)}
                      disabled={story.isGenerating}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {story.isGenerating ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>{language === 'es' ? 'Generando...' : 'Generating...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>{language === 'es' ? 'Generar Audio' : 'Generate Audio'}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Secondary Actions: Open in Workshop & Delete */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStory(story.id);
                      onNavigateToWorkshop();
                    }}
                    className="p-1.5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                    title="Open in Story Editor"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteStory(story.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Delete story from library"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

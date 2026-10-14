import React from 'react';
import { PRELOADED_STORIES, StorySample } from '../data/stories';
import { Sparkles, Wand2, BookOpen, Clock, FileText, CheckCircle2, Loader2 } from 'lucide-react';

interface StoryEditorProps {
  title: string;
  setTitle: (title: string) => void;
  storyText: string;
  setStoryText: (text: string) => void;
  language: 'en' | 'es';
  onAnalyzeStory: () => void;
  isAnalyzing: boolean;
  directorFeedback: any;
  onApplyDirectorSettings: () => void;
  onGenerateAudio: () => void;
  isGenerating: boolean;
  selectedVoiceId: string;
  onOpenBatchImport?: () => void;
  onViewCollection?: () => void;
  readingAtmosphere?: 'daylight' | 'bedtime';
}

export const StoryEditor: React.FC<StoryEditorProps> = ({
  title,
  setTitle,
  storyText,
  setStoryText,
  language,
  onAnalyzeStory,
  isAnalyzing,
  directorFeedback,
  onApplyDirectorSettings,
  onGenerateAudio,
  isGenerating,
  selectedVoiceId,
  onOpenBatchImport,
  onViewCollection,
  readingAtmosphere = 'daylight',
}) => {
  const filteredStories = PRELOADED_STORIES.filter(
    (s) => s.language === language && (s.mode === readingAtmosphere || !s.mode)
  );

  const handleSelectStory = (sample: StorySample) => {
    setTitle(sample.title);
    setStoryText(sample.text);
  };

  const wordCount = storyText.trim() ? storyText.trim().split(/\s+/).length : 0;
  const estimatedMinutes = Math.max(0.5, Math.round((wordCount / 125) * 10) / 10);

  return (
    <div className="flex flex-col gap-5">
      
      {/* Top Story Controls: Quick Sample Selector & Word Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#F7F3EC] dark:bg-[#201D1A] border border-amber-900/10 dark:border-amber-100/10">
        <div className="flex flex-wrap items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <span className="text-xs font-semibold text-stone-800 dark:text-stone-200">
            {language === 'es' ? 'Cuentos de Ejemplo:' : 'Sample Stories:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filteredStories.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectStory(s)}
                className="px-2.5 py-1 text-xs rounded-md bg-white/80 dark:bg-stone-900/60 hover:bg-white dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-800 transition-colors cursor-pointer"
              >
                {s.title.split(' ')[0]} {s.title.split(' ')[1] || ''}...
              </button>
            ))}
          </div>

          {onOpenBatchImport && (
            <button
              type="button"
              onClick={onOpenBatchImport}
              className="ml-1 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-100/90 dark:bg-amber-950/60 hover:bg-amber-200/90 text-amber-950 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800/60 transition-colors cursor-pointer"
              title="Paste and import a list of stories"
            >
              <Sparkles className="w-3 h-3 text-amber-700 dark:text-amber-400" />
              <span>{language === 'es' ? '+ Importar Lista' : '+ Import Stories List'}</span>
            </button>
          )}
        </div>

        {/* Word count & Reading time */}
        <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400 font-mono tabular-nums">
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            {wordCount} {language === 'es' ? 'palabras' : 'words'}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            ~{estimatedMinutes} min
          </span>
        </div>
      </div>

      {/* Manuscript Canvas */}
      <div className="flex flex-col p-6 rounded-2xl bg-white/70 dark:bg-[#1E1B18] border border-amber-900/10 dark:border-amber-100/10 shadow-xs">
        {/* Story Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={language === 'es' ? 'Título del Cuento Infantil...' : "Children's Story Title..."}
          className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 bg-transparent border-b border-stone-200/60 dark:border-stone-800 pb-3 focus:outline-none focus:border-amber-600 transition-colors placeholder:text-stone-400"
        />

        {/* Story Text Area */}
        <textarea
          rows={11}
          value={storyText}
          onChange={(e) => setStoryText(e.target.value)}
          placeholder={
            language === 'es'
              ? 'Escribe o pega aquí el cuento infantil. La voz seleccionada leerá con dulzura, respetando las pausas...'
              : 'Write or paste your children’s story here. The narrator will read with natural warmth and soft bedtime pacing...'
          }
          className="mt-4 w-full bg-transparent resize-y text-stone-800 dark:text-stone-200 leading-relaxed text-[15px] font-sans focus:outline-none placeholder:text-stone-400"
        />

        {/* Manuscript Footer: Story Director & Narrate Action */}
        <div className="mt-4 pt-4 border-t border-stone-200/60 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          
          <button
            type="button"
            onClick={onAnalyzeStory}
            disabled={isAnalyzing || !storyText.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100/60 dark:bg-amber-950/40 hover:bg-amber-200/60 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
            <span>
              {isAnalyzing
                ? language === 'es'
                  ? 'Analizando cuento...'
                  : 'Analyzing Story...'
                : language === 'es'
                ? 'Consejos del Director'
                : 'Story Director Feedback'}
            </span>
          </button>

          {/* Primary Narration Action */}
          <button
            type="button"
            onClick={onGenerateAudio}
            disabled={isGenerating || !storyText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{language === 'es' ? 'Creando audio suave...' : 'Synthesizing voice...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>
                  {language === 'es' ? `Narrar con ${selectedVoiceId}` : `Narrate with ${selectedVoiceId}`}
                </span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* Story Director Insights Card */}
      {directorFeedback && (
        <div className="p-5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-300/40 dark:border-amber-800/40 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h3 className="font-serif font-semibold text-amber-950 dark:text-amber-100 text-sm">
                {language === 'es' ? 'Diagnóstico del Director de Cuentos' : 'Story Director Inspection'}
              </h3>
            </div>
            <button
              onClick={onApplyDirectorSettings}
              className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'es' ? 'Aplicar Ajustes Recomendados' : 'Apply Recommended Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-stone-900/50 border border-amber-200/40 dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                {language === 'es' ? 'Edad Sugerida' : 'Target Age'}
              </span>
              <span className="font-semibold text-stone-900 dark:text-stone-100 mt-0.5 block">
                {directorFeedback.targetAge || 'Early Readers'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-stone-900/50 border border-amber-200/40 dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                {language === 'es' ? 'Tono & Atmósfera' : 'Tone & Atmosphere'}
              </span>
              <span className="font-semibold text-stone-900 dark:text-stone-100 mt-0.5 block truncate">
                {directorFeedback.tone || 'Gentle Bedtime'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white/70 dark:bg-stone-900/50 border border-amber-200/40 dark:border-stone-800">
              <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                {language === 'es' ? 'Voz Óptima' : 'Optimal Voice Match'}
              </span>
              <span className="font-semibold text-amber-800 dark:text-amber-300 mt-0.5 block">
                {directorFeedback.recommendedVoice} (Tono +{directorFeedback.recommendedPitchOffset || 2})
              </span>
            </div>
          </div>

          <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed italic">
            "{directorFeedback.pacingSuggestion}"
          </p>
        </div>
      )}

    </div>
  );
};

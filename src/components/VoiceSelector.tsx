import React from 'react';
import { VOICES, VoiceProfile } from '../data/voices';
import { Volume2, Sparkles, RotateCcw, Play, Loader2 } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  language: 'en' | 'es';
  onPreviewVoice: (voice: VoiceProfile) => void;
  isPreviewing: boolean;
  previewVoiceId: string | null;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onSelectVoice,
  speed,
  setSpeed,
  pitch,
  setPitch,
  language,
  onPreviewVoice,
  isPreviewing,
  previewVoiceId,
}) => {
  const currentVoice = VOICES.find((v) => v.id === selectedVoiceId) || VOICES[0];

  const handleReset = () => {
    setSpeed(currentVoice.defaultSpeed);
    setPitch(currentVoice.defaultPitch);
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#F7F3EC] dark:bg-[#201D1A] border border-amber-900/10 dark:border-amber-100/10">
      
      {/* Title & Active Voice Summary */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
            {language === 'es' ? 'Voz del Narrador' : 'Narrator Voice'}
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
            {language === 'es'
              ? 'Voces naturales y suaves con registro agudo para cuentos'
              : 'Soft, natural higher-register voices crafted for children’s books'}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer"
          title="Reset speed and pitch to voice defaults"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{language === 'es' ? 'Restablecer' : 'Defaults'}</span>
        </button>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {VOICES.map((voice) => {
          const isSelected = voice.id === selectedVoiceId;
          const isThisPreviewing = isPreviewing && previewVoiceId === voice.id;

          return (
            <div
              key={voice.id}
              onClick={() => {
                onSelectVoice(voice.id);
                // Also update defaults for pitch and speed smoothly if not customized
                setPitch(voice.defaultPitch);
                setSpeed(voice.defaultSpeed);
              }}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-600/60 dark:border-amber-500/50 shadow-xs ring-1 ring-amber-600/30'
                  : 'bg-white/60 dark:bg-stone-900/40 border-stone-200/70 dark:border-stone-800/80 hover:bg-white dark:hover:bg-stone-900/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-sm">
                    {voice.name}
                  </span>
                  {voice.id === 'Achernar' && (
                    <span className="text-[10px] uppercase tracking-wider font-mono text-amber-700 dark:text-amber-400">
                      Cozy Lore
                    </span>
                  )}
                  {voice.pitchRegister === 'High' && (
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      Soft High
                    </span>
                  )}
                </div>

                {/* Quick Audition Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewVoice(voice);
                  }}
                  disabled={isPreviewing}
                  className="p-1 rounded-md text-stone-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors"
                  title="Audition short sample"
                >
                  {isThisPreviewing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
              </div>

              <div className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-1">
                {voice.characterTitle}
              </div>

              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                {voice.timbreDescription}
              </div>

              {/* Clean metadata without pill boxes */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-400 mt-2">
                <span>{voice.genderVibe}</span>
                <span aria-hidden="true">·</span>
                <span>{voice.suitability.split('(')[0].trim()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Speed & Pitch Fine-Tuning Controls */}
      <div className="pt-4 border-t border-amber-900/10 dark:border-amber-100/10 flex flex-col gap-5">
        
        {/* Speaking Speed Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-stone-800 dark:text-stone-200">
              {language === 'es' ? 'Velocidad de Lectura' : 'Speaking Speed'}
            </span>
            <span className="font-mono tabular-nums text-amber-800 dark:text-amber-300 font-semibold">
              {speed.toFixed(2)}x
            </span>
          </div>

          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.05"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-amber-700 dark:accent-amber-500 cursor-pointer h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg"
          />

          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
            <span>{language === 'es' ? '0.5x (Muy lento)' : '0.5x (Sleepy)'}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSpeed(0.9)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  speed === 0.9 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                }`}
              >
                {language === 'es' ? 'Cuento 0.90x' : 'Bedtime 0.90x'}
              </button>
              <button
                type="button"
                onClick={() => setSpeed(1.0)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  speed === 1.0 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                }`}
              >
                1.00x
              </button>
            </div>
            <span>{language === 'es' ? '1.5x (Rápido)' : '1.5x (Lively)'}</span>
          </div>
        </div>

        {/* Pitch Tuning Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-stone-800 dark:text-stone-200">
                {language === 'es' ? 'Afinación / Tono Vocal' : 'Pitch & Vocal Register'}
              </span>
              <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="font-mono tabular-nums text-amber-800 dark:text-amber-300 font-semibold">
              {pitch > 0 ? `+${pitch}` : pitch} {language === 'es' ? 'semitonos' : 'semitones'}
            </span>
          </div>

          <input
            type="range"
            min="-4"
            max="6"
            step="1"
            value={pitch}
            onChange={(e) => setPitch(parseInt(e.target.value, 10))}
            className="w-full accent-amber-700 dark:accent-amber-500 cursor-pointer h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg"
          />

          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
            <span>{language === 'es' ? '-4 (Grave)' : '-4 (Deeper)'}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPitch(0)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  pitch === 0 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                }`}
              >
                Natural (0)
              </button>
              <button
                type="button"
                onClick={() => setPitch(2)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  pitch === 2 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                }`}
              >
                {language === 'es' ? 'Suave Dulce (+2)' : 'Soft High (+2)'}
              </button>
              <button
                type="button"
                onClick={() => setPitch(3)}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  pitch === 3 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                }`}
              >
                +3
              </button>
            </div>
            <span>{language === 'es' ? '+6 (Más Agudo)' : '+6 (Highest)'}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

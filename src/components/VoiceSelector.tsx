import React from 'react';
import { VOICES, VoiceProfile } from '../data/voices';
import { Volume2, Sparkles, RotateCcw, Play, Loader2, Sun, Moon } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
  language: 'en' | 'es';
  readingAtmosphere: 'daylight' | 'bedtime';
  setReadingAtmosphere: (mode: 'daylight' | 'bedtime') => void;
  onPreviewVoice: (voice: VoiceProfile, mode?: 'daylight' | 'bedtime') => void;
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
  readingAtmosphere,
  setReadingAtmosphere,
  onPreviewVoice,
  isPreviewing,
  previewVoiceId,
}) => {
  const currentVoice = VOICES.find((v) => v.id === selectedVoiceId) || VOICES[0];
  const isDaylight = readingAtmosphere === 'daylight';

  const handleReset = () => {
    if (isDaylight) {
      setSpeed(currentVoice.daylightSpeed);
      setPitch(currentVoice.daylightPitch);
    } else {
      setSpeed(currentVoice.defaultSpeed);
      setPitch(currentVoice.defaultPitch);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-[#F7F3EC] dark:bg-[#201D1A] border border-amber-900/10 dark:border-amber-100/10">
      
      {/* Title & Atmosphere Switcher Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <span>{language === 'es' ? 'Voz del Narrador' : 'Narrator Voice'}</span>
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">
                {isDaylight ? (language === 'es' ? '☀️ Luz del Día' : '☀️ Sweet Daylight') : (language === 'es' ? '🌙 Nanas y Dormir' : '🌙 Bedtime Lullaby')}
              </span>
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
              {isDaylight
                ? language === 'es'
                  ? 'Ritmo dulce, alegre y natural para cuentos a la luz del sol'
                  : 'Sweet, natural flowing pace and cheerful warmth for daytime story hour'
                : language === 'es'
                ? 'Cadencia suave y pausada para arrullar a los niños antes de dormir'
                : 'Whisper-soft, soothing slow cadence for bedtime sleep tales'}
            </p>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer shrink-0"
            title="Reset speed and pitch to voice defaults"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'es' ? 'Restablecer' : 'Defaults'}</span>
          </button>
        </div>

        {/* In-Panel Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-white/70 dark:bg-stone-900/70 border border-amber-900/10 dark:border-amber-100/10">
          <button
            type="button"
            onClick={() => {
              setReadingAtmosphere('daylight');
              setSpeed(currentVoice.daylightSpeed);
              setPitch(currentVoice.daylightPitch);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isDaylight
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Modo Luz del Día (Dulce y Natural)' : 'Sweet Daylight (Natural Pace)'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setReadingAtmosphere('bedtime');
              setSpeed(currentVoice.defaultSpeed);
              setPitch(currentVoice.defaultPitch);
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              !isDaylight
                ? 'bg-indigo-900 text-indigo-100 shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>{language === 'es' ? 'Modo Para Dormir (Suave y Pausado)' : 'Bedtime Stories (Soothing)'}</span>
          </button>
        </div>
      </div>

      {/* Voice Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {VOICES.map((voice) => {
          const isSelected = voice.id === selectedVoiceId;
          const isThisPreviewing = isPreviewing && previewVoiceId === voice.id;

          const titleToDisplay = isDaylight ? voice.daylightTitle : voice.characterTitle;
          const descToDisplay = isDaylight ? voice.daylightDescription : voice.timbreDescription;

          return (
            <div
              key={voice.id}
              onClick={() => {
                onSelectVoice(voice.id);
                setPitch(isDaylight ? voice.daylightPitch : voice.defaultPitch);
                setSpeed(isDaylight ? voice.daylightSpeed : voice.defaultSpeed);
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
                      Grandfather
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
                    onPreviewVoice(voice, readingAtmosphere);
                  }}
                  disabled={isPreviewing}
                  className="p-1 rounded-md text-stone-500 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-colors cursor-pointer"
                  title={`Audition sample in ${isDaylight ? 'sweet daylight' : 'bedtime'} mode`}
                >
                  {isThisPreviewing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-current" />
                  )}
                </button>
              </div>

              <div className="text-xs text-stone-700 dark:text-stone-300 font-medium mt-1">
                {titleToDisplay}
              </div>

              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                {descToDisplay}
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
            min="0.6"
            max="1.5"
            step="0.02"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full accent-amber-700 dark:accent-amber-500 cursor-pointer h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg"
          />

          <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
            <span>0.6x</span>
            <div className="flex items-center gap-2">
              {isDaylight ? (
                <>
                  <button
                    type="button"
                    onClick={() => setSpeed(0.96)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      speed === 0.96 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                    }`}
                  >
                    {language === 'es' ? 'Tranquilo 0.96x' : 'Gentle 0.96x'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeed(1.02)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      speed === 1.02 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                    }`}
                  >
                    {language === 'es' ? 'Día Natural 1.02x' : 'Daylight 1.02x'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeed(1.08)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      speed === 1.08 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                    }`}
                  >
                    {language === 'es' ? 'Vivaz 1.08x' : 'Lively 1.08x'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setSpeed(0.85)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      speed === 0.85 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                    }`}
                  >
                    {language === 'es' ? 'Somnoliento 0.85x' : 'Sleepy 0.85x'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeed(0.90)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      speed === 0.90 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                    }`}
                  >
                    {language === 'es' ? 'Cuento Noche 0.90x' : 'Bedtime 0.90x'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpeed(1.00)}
                    className={`px-1.5 py-0.5 rounded transition-colors ${
                      speed === 1.00 ? 'text-amber-800 dark:text-amber-300 font-bold' : 'hover:text-stone-800'
                    }`}
                  >
                    1.00x
                  </button>
                </>
              )}
            </div>
            <span>1.5x</span>
          </div>
        </div>

        {/* Pitch Tuning Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-stone-800 dark:text-stone-200">
                {language === 'es' ? 'Afinación / Registro Vocal' : 'Pitch & Vocal Register'}
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
            <span>-4</span>
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
                {isDaylight ? (language === 'es' ? 'Dulce Sol (+2)' : 'Sunny Sweet (+2)') : (language === 'es' ? 'Nana (+2)' : 'Soft Lullaby (+2)')}
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
            <span>+6</span>
          </div>
        </div>

      </div>

    </div>
  );
};

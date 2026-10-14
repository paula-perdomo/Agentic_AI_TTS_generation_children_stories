import React, { useState } from 'react';
import { BENCHMARK_TESTS, BenchmarkTest } from '../data/benchmarks';
import { VOICES, VoiceProfile } from '../data/voices';
import { Play, Pause, Loader2, Award, Sparkles, CheckCircle, Volume2, Sun, Moon } from 'lucide-react';

interface AuditionSuiteProps {
  language: 'en' | 'es';
  currentVoiceId: string;
  onApplyVoice: (voiceId: string) => void;
  speed: number;
  pitch: number;
  readingAtmosphere?: 'daylight' | 'bedtime';
}

export const AuditionSuite: React.FC<AuditionSuiteProps> = ({
  language,
  currentVoiceId,
  onApplyVoice,
  speed,
  pitch,
  readingAtmosphere = 'daylight',
}) => {
  const [selectedTestId, setSelectedTestId] = useState<string>(BENCHMARK_TESTS[0].id);
  const [auditionMode, setAuditionMode] = useState<'daylight' | 'bedtime'>(readingAtmosphere);
  const [testVoiceId, setTestVoiceId] = useState<string>(currentVoiceId);
  const [compareVoiceId, setCompareVoiceId] = useState<string>('Achernar');
  const [isAuditioning, setIsAuditioning] = useState<boolean>(false);
  const [auditioningTarget, setAuditioningTarget] = useState<'primary' | 'compare' | null>(null);
  const [activeAudioUrl, setActiveAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeTest = BENCHMARK_TESTS.find((t) => t.id === selectedTestId) || BENCHMARK_TESTS[0];
  const activeVoice = VOICES.find((v) => v.id === testVoiceId) || VOICES[0];
  const compareVoice = VOICES.find((v) => v.id === compareVoiceId) || VOICES[1];

  const isDaylight = auditionMode === 'daylight';

  // Dynamic test phrase depending on Daylight vs Bedtime
  const testText = isDaylight
    ? language === 'es'
      ? activeTest.testPhraseDaylightEs
      : activeTest.testPhraseDaylightEn
    : language === 'es'
    ? activeTest.testPhraseEs
    : activeTest.testPhraseEn;

  const handleRunAudition = async (target: 'primary' | 'compare') => {
    const targetVoice = target === 'primary' ? testVoiceId : compareVoiceId;
    setIsAuditioning(true);
    setAuditioningTarget(target);

    try {
      if (audioElement) {
        audioElement.pause();
        setIsPlaying(false);
      }

      const styleDirective = isDaylight
        ? language === 'es'
          ? 'Voz dulce, alegre, luminosa y natural de cuentacuentos infantil. Tono amigable, vivaz y tierno a la luz del día.'
          : 'Sweet, cheerful, bright children’s storybook narrator with a sunny, friendly higher pitch, engaging natural curiosity, and sweet flowing daylight pace.'
        : language === 'es'
        ? 'Voz suave, dulce y reconfortante de narradora de cuentos infantiles. Tono cálido, amigable, con cadencia rítmica para antes de dormir.'
        : 'Soft, gentle, warm children’s book narrator with a comforting bedtime cadence, peaceful measured pacing, and quiet articulation.';

      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: testText,
          voice: targetVoice,
          language,
          mode: auditionMode,
          style: styleDirective,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate benchmark test clip.');
      }

      const data = await res.json();
      const audioUrl = `data:audio/wav;base64,${data.audioBase64}`;
      setActiveAudioUrl(audioUrl);

      const audio = new Audio(audioUrl);
      // In daylight mode, audition at sweet natural pace (1.02x) unless customized
      audio.playbackRate = isDaylight && speed < 0.95 ? 1.02 : speed;
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);

      setAudioElement(audio);
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error('Audition Error:', err);
    } finally {
      setIsAuditioning(false);
      setAuditioningTarget(null);
    }
  };

  const handleTogglePlayback = () => {
    if (!audioElement) return;
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-24">
      
      {/* Suite Header */}
      <div className="p-6 rounded-2xl bg-[#F7F3EC] dark:bg-[#201D1A] border border-amber-900/10 dark:border-amber-100/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <h2 className="font-serif text-xl font-bold text-stone-900 dark:text-stone-100">
                {language === 'es'
                  ? 'Estudio de Audición y Pruebas de Consistencia'
                  : 'Voice Audition & Consistency Testing Suite'}
              </h2>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-2xl leading-relaxed">
              {isDaylight
                ? language === 'es'
                  ? 'Audiciona las voces en un entorno de lectura a la luz del día, con ritmo dulce, fluido y vivaz.'
                  : 'Audition narrators in a sweet daylight reading setup with sunny, natural pacing and bright warmth.'
                : language === 'es'
                ? 'Audiciona las voces con ritmo pausado y cadencia arrulladora para antes de dormir.'
                : 'Audition narrators with slow, comforting lullaby cadence designed for sleep time.'}
            </p>
          </div>

          {/* Audition Mode Switcher: Daylight vs Bedtime */}
          <div className="flex items-center p-1 rounded-xl bg-white/80 dark:bg-stone-900 border border-amber-900/10 dark:border-amber-100/10 shrink-0">
            <button
              type="button"
              onClick={() => setAuditionMode('daylight')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                isDaylight
                  ? 'bg-amber-500 text-amber-950 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Luz del Día' : 'Sweet Daylight'}</span>
            </button>

            <button
              type="button"
              onClick={() => setAuditionMode('bedtime')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                !isDaylight
                  ? 'bg-indigo-900 text-indigo-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{language === 'es' ? 'Para Dormir' : 'Bedtime'}</span>
            </button>
          </div>
        </div>

        {/* Benchmark Test Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-5">
          {BENCHMARK_TESTS.map((test) => {
            const isSelected = test.id === selectedTestId;
            return (
              <button
                key={test.id}
                type="button"
                onClick={() => setSelectedTestId(test.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100/70 dark:bg-amber-950/40 border-amber-600 dark:border-amber-500 shadow-xs'
                    : 'bg-white/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 hover:bg-white dark:hover:bg-stone-900'
                }`}
              >
                <div className="text-[11px] font-mono text-amber-800 dark:text-amber-400 uppercase tracking-wider">
                  {test.category}
                </div>
                <div className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-xs mt-0.5 line-clamp-1">
                  {test.name}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                  {test.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Benchmark Test Card */}
      <div className="p-6 rounded-2xl bg-white/70 dark:bg-[#1E1B18] border border-amber-900/10 dark:border-amber-100/10 shadow-xs flex flex-col gap-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/60 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {activeTest.category} · {language === 'es' ? 'Texto de Prueba' : 'Benchmark Passage'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                {isDaylight ? (language === 'es' ? '☀️ Frase de Día' : '☀️ Daylight Passage') : (language === 'es' ? '🌙 Frase de Noche' : '🌙 Bedtime Passage')}
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {activeTest.name}
            </h3>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400 italic">
            {isDaylight ? activeTest.optimalVoiceDaylightHint : activeTest.optimalVoiceHint}
          </span>
        </div>

        {/* Test Phrase Display */}
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30">
          <p className="font-serif text-base sm:text-lg text-stone-900 dark:text-stone-100 leading-relaxed italic">
            "{testText}"
          </p>
          <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{activeTest.verificationFocus}</span>
          </div>
        </div>

        {/* Side-by-Side Voice Comparison Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Voice A Audition Card */}
          <div className="p-4 rounded-xl bg-[#FDFBF7] dark:bg-[#201D1A] border border-stone-200 dark:border-stone-800 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-stone-500">
                  {language === 'es' ? 'Voz A (Principal)' : 'Voice A (Primary)'}
                </span>
                <select
                  value={testVoiceId}
                  onChange={(e) => setTestVoiceId(e.target.value)}
                  className="text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2 py-1 text-stone-900 dark:text-stone-100"
                >
                  {VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({isDaylight ? v.daylightTitle : v.characterTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-stone-600 dark:text-stone-400 font-medium">
                  {isDaylight ? activeVoice.daylightTitle : activeVoice.characterTitle}
                </span>
                <span className="font-mono tabular-nums text-amber-800 dark:text-amber-300 font-semibold">
                  {activeVoice.pitchRegister}
                </span>
              </div>

              <div className="text-[11px] text-stone-500 mt-1 line-clamp-2 italic">
                {isDaylight ? activeVoice.daylightDescription : activeVoice.timbreDescription}
              </div>

              {/* Consistency Metrics breakdown */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 text-center">
                <div className="p-1.5 rounded bg-white/60 dark:bg-stone-900/40">
                  <span className="text-[10px] text-stone-500 block">Claridad</span>
                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                    {activeVoice.consistencyMetrics.clarity}%
                  </span>
                </div>
                <div className="p-1.5 rounded bg-white/60 dark:bg-stone-900/40">
                  <span className="text-[10px] text-stone-500 block">Estabilidad</span>
                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                    {activeVoice.consistencyMetrics.stability}%
                  </span>
                </div>
                <div className="p-1.5 rounded bg-white/60 dark:bg-stone-900/40">
                  <span className="text-[10px] text-stone-500 block">Calidez</span>
                  <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400">
                    {activeVoice.consistencyMetrics.warmth}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleRunAudition('primary')}
                disabled={isAuditioning}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAuditioning && auditioningTarget === 'primary' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>
                  {language === 'es'
                    ? `Audicionar ${activeVoice.name} (${isDaylight ? 'Día' : 'Noche'})`
                    : `Audition ${activeVoice.name} (${isDaylight ? 'Day' : 'Bedtime'})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onApplyVoice(activeVoice.id)}
                className="px-3 py-2 text-xs font-medium text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 hover:bg-amber-200 rounded-lg transition-colors cursor-pointer"
                title="Select this voice for the manuscript"
              >
                {language === 'es' ? 'Elegir' : 'Select'}
              </button>
            </div>
          </div>

          {/* Voice B Audition Card (Comparison) */}
          <div className="p-4 rounded-xl bg-[#FDFBF7] dark:bg-[#201D1A] border border-stone-200 dark:border-stone-800 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-stone-500">
                  {language === 'es' ? 'Voz B (Comparación)' : 'Voice B (Comparison)'}
                </span>
                <select
                  value={compareVoiceId}
                  onChange={(e) => setCompareVoiceId(e.target.value)}
                  className="text-xs font-semibold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-md px-2 py-1 text-stone-900 dark:text-stone-100"
                >
                  {VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({isDaylight ? v.daylightTitle : v.characterTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-stone-600 dark:text-stone-400 font-medium">
                  {isDaylight ? compareVoice.daylightTitle : compareVoice.characterTitle}
                </span>
                <span className="font-mono tabular-nums text-amber-800 dark:text-amber-300 font-semibold">
                  {compareVoice.pitchRegister}
                </span>
              </div>

              <div className="text-[11px] text-stone-500 mt-1 line-clamp-2 italic">
                {isDaylight ? compareVoice.daylightDescription : compareVoice.timbreDescription}
              </div>

              {/* Consistency Metrics breakdown */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 text-center">
                <div className="p-1.5 rounded bg-white/60 dark:bg-stone-900/40">
                  <span className="text-[10px] text-stone-500 block">Claridad</span>
                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                    {compareVoice.consistencyMetrics.clarity}%
                  </span>
                </div>
                <div className="p-1.5 rounded bg-white/60 dark:bg-stone-900/40">
                  <span className="text-[10px] text-stone-500 block">Estabilidad</span>
                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100">
                    {compareVoice.consistencyMetrics.stability}%
                  </span>
                </div>
                <div className="p-1.5 rounded bg-white/60 dark:bg-stone-900/40">
                  <span className="text-[10px] text-stone-500 block">Calidez</span>
                  <span className="font-mono text-xs font-bold text-amber-800 dark:text-amber-400">
                    {compareVoice.consistencyMetrics.warmth}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleRunAudition('compare')}
                disabled={isAuditioning}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-stone-700 hover:bg-stone-800 dark:bg-stone-600 dark:hover:bg-stone-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isAuditioning && auditioningTarget === 'compare' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>
                  {language === 'es'
                    ? `Audicionar ${compareVoice.name} (${isDaylight ? 'Día' : 'Noche'})`
                    : `Audition ${compareVoice.name} (${isDaylight ? 'Day' : 'Bedtime'})`}
                </span>
              </button>

              <button
                type="button"
                onClick={() => onApplyVoice(compareVoice.id)}
                className="px-3 py-2 text-xs font-medium text-stone-800 dark:text-stone-200 bg-stone-200/70 dark:bg-stone-800 hover:bg-stone-300 rounded-lg transition-colors cursor-pointer"
                title="Select this voice for the manuscript"
              >
                {language === 'es' ? 'Elegir' : 'Select'}
              </button>
            </div>
          </div>

        </div>

        {/* Live Audio Playback bar if clip generated */}
        {activeAudioUrl && (
          <div className="p-3 rounded-xl bg-amber-100/50 dark:bg-amber-950/30 border border-amber-300/40 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-950 dark:text-amber-100">
              <Volume2 className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span>
                {language === 'es'
                  ? `Clip ${isDaylight ? 'Luz del Día' : 'Para Dormir'} Listo`
                  : `${isDaylight ? 'Sweet Daylight' : 'Bedtime'} Clip Ready`}
              </span>
              <span className="text-[11px] text-stone-500 font-mono">
                ({isDaylight ? 'Ritmo Dulce y Natural' : 'Ritmo Calmo'} · {pitch > 0 ? `+${pitch}` : pitch} st)
              </span>
            </div>

            <button
              type="button"
              onClick={handleTogglePlayback}
              className="px-3 py-1 text-xs font-semibold text-amber-900 dark:text-amber-100 bg-white dark:bg-stone-800 rounded-md border border-amber-300/60 dark:border-stone-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isPlaying ? 'Pausar' : 'Escuchar de nuevo'}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

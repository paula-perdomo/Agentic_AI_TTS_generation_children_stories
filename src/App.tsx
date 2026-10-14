/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { StoryEditor } from './components/StoryEditor';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AuditionSuite } from './components/AuditionSuite';
import { FocusReaderModal } from './components/FocusReaderModal';
import { StoryCollection, StoryItem } from './components/StoryCollection';
import { BatchImportModal } from './components/BatchImportModal';
import { VOICES, VoiceProfile } from './data/voices';
import { PRELOADED_STORIES } from './data/stories';
import {
  base64ToArrayBuffer,
  renderProcessedBuffer,
  audioBufferToMp3,
  downloadMp3,
} from './utils/audioProcessor';
import { Sparkles, Sun, Moon, AlertCircle, Square, Loader2 } from 'lucide-react';

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<'workshop' | 'collection' | 'audition'>('workshop');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [readingAtmosphere, setReadingAtmosphere] = useState<'daylight' | 'bedtime'>('daylight');
  const [isBedtimeMode, setIsBedtimeMode] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);

  // Initialize Stories Collection from preloaded stories
  const [stories, setStories] = useState<StoryItem[]>(() =>
    PRELOADED_STORIES.map((s) => ({
      id: s.id,
      title: s.title,
      text: s.text,
      language: s.language,
      voiceId: s.recommendedVoice,
      speed: s.recommendedSpeed,
      pitch: s.recommendedPitch,
      audioBuffer: null,
      isGenerating: false,
      error: null,
    }))
  );

  const initialStory =
    PRELOADED_STORIES.find((s) => s.language === 'en' && s.mode === 'daylight') ||
    PRELOADED_STORIES[0];
  const [currentStoryId, setCurrentStoryId] = useState<string>(initialStory.id);

  // Active Story Manuscript State
  const activeStory = stories.find((s) => s.id === currentStoryId) || stories[0];
  const [title, setTitle] = useState<string>(activeStory.title);
  const [storyText, setStoryText] = useState<string>(activeStory.text);

  // Voice & Tuning State for active story
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(activeStory.voiceId);
  const [speed, setSpeed] = useState<number>(activeStory.speed);
  const [pitch, setPitch] = useState<number>(activeStory.pitch);

  // Director feedback
  const [directorFeedback, setDirectorFeedback] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Audio Playback State
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Batch Generation State
  const [isBatchGenerating, setIsBatchGenerating] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | null>(null);
  const isBatchCancelledRef = useRef<boolean>(false);
  const batchAbortControllerRef = useRef<AbortController | null>(null);

  // Audition preview state
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
  const [previewVoiceId, setPreviewVoiceId] = useState<string | null>(null);

  // Active playing story ID in collection
  const [activeCollectionPlayingId, setActiveCollectionPlayingId] = useState<string | null>(null);

  // Web Audio References
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Dark mode effect
  useEffect(() => {
    if (isBedtimeMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isBedtimeMode]);

  // When readingAtmosphere switches, adapt defaults for active voice and theme
  const handleSwitchAtmosphere = (newMode: 'daylight' | 'bedtime') => {
    setReadingAtmosphere(newMode);
    const voice = VOICES.find((v) => v.id === selectedVoiceId) || VOICES[0];
    if (newMode === 'daylight') {
      setSpeed(voice.daylightSpeed);
      setPitch(voice.daylightPitch);
      setIsBedtimeMode(false);
    } else {
      setSpeed(voice.defaultSpeed);
      setPitch(voice.defaultPitch);
      setIsBedtimeMode(true);
    }

    // Switch to a matching sample story if the current story hasn't been heavily modified
    const matchingSample = PRELOADED_STORIES.find(
      (s) => s.language === language && s.mode === newMode
    );
    if (matchingSample) {
      handleSelectStory(matchingSample.id);
    }
  };

  // Sync active story edits back into stories list
  useEffect(() => {
    setStories((prev) =>
      prev.map((s) =>
        s.id === currentStoryId
          ? {
              ...s,
              title,
              text: storyText,
              voiceId: selectedVoiceId,
              speed,
              pitch,
              audioBuffer,
            }
          : s
      )
    );
  }, [title, storyText, selectedVoiceId, speed, pitch, audioBuffer, currentStoryId]);

  // Ensure AudioContext is initialized
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  // Stop active playback node
  const stopCurrentSource = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch (e) {
        // Ignore if already stopped
      }
      sourceNodeRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  // Track playback time
  const updatePlaybackTime = () => {
    if (!audioContextRef.current || !isPlaying) return;
    const elapsed = (audioContextRef.current.currentTime - startTimeRef.current) * speed;
    const current = Math.min(duration, Math.max(0, pausedAtRef.current + elapsed));
    setCurrentTime(current);

    if (current >= duration) {
      setIsPlaying(false);
      setCurrentTime(0);
      pausedAtRef.current = 0;
      setActiveCollectionPlayingId(null);
      stopCurrentSource();
    } else {
      animFrameRef.current = requestAnimationFrame(updatePlaybackTime);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(updatePlaybackTime);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, duration, speed]);

  // Play audio buffer from an offset
  const playFromOffset = (offsetSeconds: number, targetBuffer: AudioBuffer = audioBuffer!) => {
    if (!targetBuffer) return;
    const ctx = getAudioContext();
    stopCurrentSource();

    const source = ctx.createBufferSource();
    source.buffer = targetBuffer;
    source.playbackRate.value = speed;
    if (pitch !== 0) {
      source.detune.value = pitch * 100;
    }

    source.connect(ctx.destination);
    const safeOffset = Math.max(0, Math.min(offsetSeconds, targetBuffer.duration));
    source.start(0, safeOffset);

    sourceNodeRef.current = source;
    startTimeRef.current = ctx.currentTime;
    pausedAtRef.current = safeOffset;
    setCurrentTime(safeOffset);
    setIsPlaying(true);
  };

  // Toggle Play / Pause in main bar
  const handleTogglePlay = () => {
    if (!audioBuffer) return;
    if (isPlaying) {
      if (audioContextRef.current) {
        const elapsed = (audioContextRef.current.currentTime - startTimeRef.current) * speed;
        pausedAtRef.current = Math.min(duration, pausedAtRef.current + elapsed);
      }
      stopCurrentSource();
      setIsPlaying(false);
      setActiveCollectionPlayingId(null);
    } else {
      playFromOffset(pausedAtRef.current >= duration ? 0 : pausedAtRef.current);
      setActiveCollectionPlayingId(currentStoryId);
    }
  };

  // Seek timeline
  const handleSeek = (newTime: number) => {
    pausedAtRef.current = newTime;
    setCurrentTime(newTime);
    if (isPlaying) {
      playFromOffset(newTime);
    }
  };

  // Switch active story from collection or selector
  const handleSelectStory = (id: string) => {
    const target = stories.find((s) => s.id === id);
    if (!target) return;

    stopCurrentSource();
    setIsPlaying(false);
    setActiveCollectionPlayingId(null);

    setCurrentStoryId(target.id);
    setTitle(target.title);
    setStoryText(target.text);
    setSelectedVoiceId(target.voiceId);
    setSpeed(target.speed);
    setPitch(target.pitch);
    setAudioBuffer(target.audioBuffer);
    setDuration(target.audioBuffer ? target.audioBuffer.duration : 0);
    setCurrentTime(0);
    pausedAtRef.current = 0;
    setDirectorFeedback(null);
  };

  // Generate single story audio
  const handleGenerateStoryById = async (
    targetId: string,
    signal?: AbortSignal
  ): Promise<AudioBuffer | null> => {
    const target = stories.find((s) => s.id === targetId);
    if (!target || !target.text.trim()) return null;

    setStories((prev) =>
      prev.map((s) => (s.id === targetId ? { ...s, isGenerating: true, error: null } : s))
    );

    try {
      const isDay = readingAtmosphere === 'daylight';
      const stylePrompt = isDay
        ? target.language === 'es'
          ? 'Cuento infantil para leer de día. Voz dulce, alegre y natural con ritmo fluido, entusiasta y cálido.'
          : 'Sweet, cheerful daylight children storybook reading. Bright friendly higher pitch, engaging natural cadence.'
        : target.language === 'es'
        ? 'Cuento infantil para antes de dormir. Tono dulce, voz suave con registro relajante y pausado.'
        : 'Children bedtime storybook narration. Soft, gentle voice with natural higher pitch warmth, measured calming cadence.';

      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: target.text,
          voice: target.voiceId,
          language: target.language,
          mode: readingAtmosphere,
          style: stylePrompt,
        }),
        signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to synthesize speech.');
      }

      const data = await response.json();
      const arrayBuffer = base64ToArrayBuffer(data.audioBase64);
      const ctx = getAudioContext();
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);

      setStories((prev) =>
        prev.map((s) =>
          s.id === targetId
            ? { ...s, audioBuffer: decodedBuffer, isGenerating: false, error: null }
            : s
        )
      );

      if (targetId === currentStoryId) {
        setAudioBuffer(decodedBuffer);
        setDuration(decodedBuffer.duration);
      }

      return decodedBuffer;
    } catch (err: any) {
      if (err.name === 'AbortError' || signal?.aborted) {
        setStories((prev) =>
          prev.map((s) => (s.id === targetId ? { ...s, isGenerating: false } : s))
        );
        return null;
      }
      console.error(`Audio error for story ${targetId}:`, err);
      setStories((prev) =>
        prev.map((s) =>
          s.id === targetId ? { ...s, isGenerating: false, error: err.message } : s
        )
      );
      return null;
    }
  };

  // Generate audio for active story
  const handleGenerateAudio = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    stopCurrentSource();
    setIsPlaying(false);

    const buffer = await handleGenerateStoryById(currentStoryId);
    setIsGenerating(false);

    if (buffer) {
      setTimeout(() => {
        playFromOffset(0, buffer);
      }, 200);
    } else {
      setErrorMessage('Could not generate speech. Please try again.');
    }
  };

  // Batch generate all pending stories
  const handleGenerateAllPending = async () => {
    const pendingStories = stories.filter((s) => s.audioBuffer === null);
    if (pendingStories.length === 0) return;

    isBatchCancelledRef.current = false;
    const controller = new AbortController();
    batchAbortControllerRef.current = controller;

    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: pendingStories.length });

    try {
      for (let i = 0; i < pendingStories.length; i++) {
        if (isBatchCancelledRef.current) break;
        const s = pendingStories[i];
        setBatchProgress({ current: i + 1, total: pendingStories.length });
        await handleGenerateStoryById(s.id, controller.signal);
        if (isBatchCancelledRef.current) break;
      }
    } finally {
      setIsBatchGenerating(false);
      setBatchProgress(null);
      batchAbortControllerRef.current = null;
      isBatchCancelledRef.current = false;
      setStories((prev) =>
        prev.map((s) => (s.isGenerating ? { ...s, isGenerating: false } : s))
      );
    }
  };

  // Stop batch generation
  const handleStopBatchGeneration = () => {
    isBatchCancelledRef.current = true;
    if (batchAbortControllerRef.current) {
      try {
        batchAbortControllerRef.current.abort();
      } catch (e) {
        // Ignore abort exception
      }
    }
    setIsBatchGenerating(false);
    setBatchProgress(null);
    setStories((prev) =>
      prev.map((s) => (s.isGenerating ? { ...s, isGenerating: false } : s))
    );
  };

  // Download MP3 for specific story
  const handleDownloadStoryMp3 = async (story: StoryItem) => {
    if (!story.audioBuffer) return;
    setIsDownloading(true);

    try {
      const renderedBuffer = await renderProcessedBuffer(
        story.audioBuffer,
        story.speed,
        story.pitch
      );
      const mp3Blob = audioBufferToMp3(renderedBuffer, 128);

      const safeFilename =
        (story.title.trim() || 'story')
          .toLowerCase()
          .replace(/[^a-z0-9_\-\u00C0-\u017F]+/gi, '_')
          .slice(0, 40) + `_${story.voiceId.toLowerCase()}_${readingAtmosphere}.mp3`;

      downloadMp3(mp3Blob, safeFilename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Download error:', err);
      setErrorMessage(`Failed to encode MP3: ${err?.message || err}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Toggle play/pause directly on story card in collection
  const handleTogglePlayStory = (story: StoryItem) => {
    if (!story.audioBuffer) return;

    if (activeCollectionPlayingId === story.id && isPlaying) {
      stopCurrentSource();
      setIsPlaying(false);
      setActiveCollectionPlayingId(null);
    } else {
      handleSelectStory(story.id);
      setTimeout(() => {
        playFromOffset(0, story.audioBuffer!);
        setActiveCollectionPlayingId(story.id);
      }, 100);
    }
  };

  // Import batch of stories
  const handleImportStories = (newStoriesParsed: any[]) => {
    const newItems: StoryItem[] = newStoriesParsed.map((p, idx) => ({
      id: `imported-${Date.now()}-${idx}`,
      title: p.title,
      text: p.text,
      language: p.language,
      voiceId: p.recommendedVoice || 'Kore',
      speed: readingAtmosphere === 'daylight' ? 1.02 : 0.92,
      pitch: 2,
      audioBuffer: null,
      isGenerating: false,
      error: null,
    }));

    setStories((prev) => [...newItems, ...prev]);

    // Select the first imported story
    if (newItems.length > 0) {
      handleSelectStory(newItems[0].id);
      setActiveTab('collection');
    }
  };

  // Add single empty story
  const handleAddNewStory = () => {
    const newId = `story-${Date.now()}`;
    const newStory: StoryItem = {
      id: newId,
      title: language === 'es' ? 'Nuevo Cuento Infantil' : 'New Story',
      text: '',
      language,
      voiceId: 'Kore',
      speed: readingAtmosphere === 'daylight' ? 1.02 : 0.92,
      pitch: 2,
      audioBuffer: null,
      isGenerating: false,
    };

    setStories((prev) => [newStory, ...prev]);
    handleSelectStory(newId);
    setActiveTab('workshop');
  };

  // Delete story
  const handleDeleteStory = (id: string) => {
    if (stories.length <= 1) return;
    setStories((prev) => prev.filter((s) => s.id !== id));
    if (currentStoryId === id) {
      const remaining = stories.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        handleSelectStory(remaining[0].id);
      }
    }
  };

  // Update voice on individual story in collection
  const handleUpdateStoryVoice = (id: string, voiceId: string) => {
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const voiceChanged = s.voiceId !== voiceId;
          return {
            ...s,
            voiceId,
            audioBuffer: voiceChanged ? null : s.audioBuffer,
            error: voiceChanged ? null : s.error,
          };
        }
        return s;
      })
    );
    if (id === currentStoryId) {
      setSelectedVoiceId(voiceId);
      if (activeStory.voiceId !== voiceId) {
        setAudioBuffer(null);
      }
    }
  };

  // Update voice for all or filtered stories
  const handleUpdateAllStoriesVoice = (voiceId: string, storyIds?: string[]) => {
    setStories((prev) =>
      prev.map((s) => {
        if (!storyIds || storyIds.includes(s.id)) {
          const voiceChanged = s.voiceId !== voiceId;
          return {
            ...s,
            voiceId,
            audioBuffer: voiceChanged ? null : s.audioBuffer,
            error: voiceChanged ? null : s.error,
          };
        }
        return s;
      })
    );
    if (!storyIds || storyIds.includes(currentStoryId)) {
      setSelectedVoiceId(voiceId);
      if (activeStory.voiceId !== voiceId) {
        setAudioBuffer(null);
      }
    }
  };

  // Agentic Story Director Inspection
  const handleAnalyzeStory = async () => {
    if (!storyText.trim()) return;
    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/story/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: storyText, language }),
      });

      if (!response.ok) throw new Error('Failed to analyze story.');
      const data = await response.json();
      setDirectorFeedback(data);
    } catch (err: any) {
      console.error('Director Analysis Error:', err);
      setErrorMessage('Could not complete director analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Apply Director Recommendations
  const handleApplyDirectorSettings = () => {
    if (!directorFeedback) return;
    if (directorFeedback.recommendedVoice) {
      const matched = VOICES.find(
        (v) => v.id.toLowerCase() === directorFeedback.recommendedVoice.toLowerCase()
      );
      if (matched) setSelectedVoiceId(matched.id);
    }
    if (typeof directorFeedback.recommendedPitchOffset === 'number') {
      setPitch(directorFeedback.recommendedPitchOffset);
    }
    if (typeof directorFeedback.recommendedSpeed === 'number') {
      setSpeed(directorFeedback.recommendedSpeed);
    }
  };

  // Quick voice preview audition with DAYLIGHT vs BEDTIME phrase & pace
  const handlePreviewVoice = async (voice: VoiceProfile, previewMode?: 'daylight' | 'bedtime') => {
    const effectiveMode = previewMode || readingAtmosphere;
    const isDay = effectiveMode === 'daylight';

    setIsPreviewing(true);
    setPreviewVoiceId(voice.id);
    stopCurrentSource();
    setIsPlaying(false);

    try {
      const sampleText = isDay
        ? language === 'es'
          ? voice.samplePhraseDaylightEs
          : voice.samplePhraseDaylightEn
        : language === 'es'
        ? voice.samplePhraseEs
        : voice.samplePhraseEn;

      const styleDirective = isDay
        ? language === 'es'
          ? 'Voz dulce, alegre, luminosa y natural de cuentacuentos infantil. Tono amigable, vivaz y tierno a la luz del día.'
          : 'Sweet, cheerful, bright children’s storybook narrator with a sunny, friendly higher pitch, engaging natural curiosity, sweet flowing daylight pace, and joyful warmth.'
        : language === 'es'
        ? 'Voz suave, dulce y reconfortante de narradora de cuentos infantiles. Tono cálido, amigable, con cadencia rítmica para antes de dormir.'
        : 'Soft, gentle, warm children’s book narrator with a comforting bedtime cadence, peaceful measured pacing, and quiet articulation.';

      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          voice: voice.id,
          language,
          mode: effectiveMode,
          style: styleDirective,
        }),
      });

      if (!res.ok) throw new Error('Preview synthesis failed.');
      const data = await res.json();
      const arrayBuffer = base64ToArrayBuffer(data.audioBase64);
      const ctx = getAudioContext();
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);

      // In daylight mode, use natural daylight speed (1.02x) unless configured differently
      const auditionSpeed = isDay && speed < 0.95 ? voice.daylightSpeed : speed;
      const rendered = await renderProcessedBuffer(decodedBuffer, auditionSpeed, pitch);
      const source = ctx.createBufferSource();
      source.buffer = rendered;
      source.connect(ctx.destination);
      source.start(0);
    } catch (err) {
      console.error('Voice Preview Error:', err);
    } finally {
      setIsPreviewing(false);
      setPreviewVoiceId(null);
    }
  };

  const activeVoice = VOICES.find((v) => v.id === selectedVoiceId) || VOICES[0];
  const isDaylight = readingAtmosphere === 'daylight';

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#181614] text-stone-900 dark:text-stone-100 transition-colors duration-200">
      
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        readingAtmosphere={readingAtmosphere}
        setReadingAtmosphere={handleSwitchAtmosphere}
        isBedtimeMode={isBedtimeMode}
        setIsBedtimeMode={setIsBedtimeMode}
        isFocusMode={isFocusMode}
        setIsFocusMode={setIsFocusMode}
        hasAudio={!!audioBuffer}
        onDownloadMp3={() => handleDownloadStoryMp3(activeStory)}
        isDownloading={isDownloading}
        storyCount={stories.length}
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Active Batch Generation Banner */}
      {isBatchGenerating && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="p-3.5 rounded-xl bg-amber-50/95 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-amber-700 dark:text-amber-400 animate-spin shrink-0" />
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-100">
                  {language === 'es' ? 'Generando cuentos en lote' : 'Batch Generating Stories'}
                </span>
                <span className="text-stone-600 dark:text-stone-300 ml-2 font-mono">
                  {batchProgress
                    ? `${language === 'es' ? 'Cuento' : 'Story'} ${batchProgress.current}/${batchProgress.total}`
                    : language === 'es'
                    ? 'Iniciando...'
                    : 'Starting...'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleStopBatchGeneration}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              title={language === 'es' ? 'Detener el proceso por lote' : 'Stop batch process'}
            >
              <Square className="w-3 h-3 fill-current" />
              <span>{language === 'es' ? 'Detener Proceso' : 'Stop Process'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: Story Workshop (Editor & Narrator Casting) */}
        {activeTab === 'workshop' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-28">
            <section className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Reading Atmosphere Status Header */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F3EC] dark:bg-[#201D1A] border border-amber-900/10 dark:border-amber-100/10">
                <div className="flex items-center gap-2.5 text-xs">
                  {isDaylight ? (
                    <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold">
                      <Sun className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-bold">
                      <Moon className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                      {isDaylight
                        ? language === 'es'
                          ? 'Modo: Lectura Dulce de Día'
                          : 'Mode: Sweet Daylight Reading'
                        : language === 'es'
                        ? 'Modo: Cuentos Para Dormir'
                        : 'Mode: Bedtime Stories Focus'}
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      {isDaylight
                        ? language === 'es'
                          ? 'Cadencia vivaz, alegre y natural (1.02x)'
                          : 'Natural cheerful cadence, joyful curiosity (1.02x)'
                        : language === 'es'
                        ? 'Cadencia suave, pausada y reconfortante (0.90x)'
                        : 'Slow, soothing lullaby cadence for sleep (0.90x)'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSwitchAtmosphere(isDaylight ? 'bedtime' : 'daylight')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white/80 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isDaylight
                    ? language === 'es'
                      ? '🌙 Cambiar a Noche'
                      : '🌙 Switch to Bedtime'
                    : language === 'es'
                    ? '☀️ Cambiar a Día'
                    : '☀️ Switch to Daylight'}
                </button>
              </div>

              <StoryEditor
                title={title}
                setTitle={setTitle}
                storyText={storyText}
                setStoryText={setStoryText}
                language={language}
                onAnalyzeStory={handleAnalyzeStory}
                isAnalyzing={isAnalyzing}
                directorFeedback={directorFeedback}
                onApplyDirectorSettings={handleApplyDirectorSettings}
                onGenerateAudio={handleGenerateAudio}
                isGenerating={isGenerating}
                selectedVoiceId={selectedVoiceId}
                onOpenBatchImport={() => setIsBatchModalOpen(true)}
                onViewCollection={() => setActiveTab('collection')}
                readingAtmosphere={readingAtmosphere}
              />
            </section>

            <aside className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
              <VoiceSelector
                selectedVoiceId={selectedVoiceId}
                onSelectVoice={setSelectedVoiceId}
                speed={speed}
                setSpeed={setSpeed}
                pitch={pitch}
                setPitch={setPitch}
                language={language}
                readingAtmosphere={readingAtmosphere}
                setReadingAtmosphere={handleSwitchAtmosphere}
                onPreviewVoice={handlePreviewVoice}
                isPreviewing={isPreviewing}
                previewVoiceId={previewVoiceId}
              />
            </aside>
          </div>
        )}

        {/* VIEW 2: Stories Collection & Batch Audio Generation */}
        {activeTab === 'collection' && (
          <StoryCollection
            stories={stories}
            currentStoryId={currentStoryId}
            onSelectStory={handleSelectStory}
            onUpdateStoryVoice={handleUpdateStoryVoice}
            onUpdateAllStoriesVoice={handleUpdateAllStoriesVoice}
            onDeleteStory={handleDeleteStory}
            onOpenBatchImport={() => setIsBatchModalOpen(true)}
            onAddNewStory={handleAddNewStory}
            onGenerateSingleAudio={(id) => handleGenerateStoryById(id)}
            onGenerateAllPending={handleGenerateAllPending}
            onStopBatchGeneration={handleStopBatchGeneration}
            isBatchGenerating={isBatchGenerating}
            batchProgress={batchProgress}
            onDownloadStoryMp3={handleDownloadStoryMp3}
            isDownloading={isDownloading}
            activePlayingId={activeCollectionPlayingId}
            onTogglePlayStory={handleTogglePlayStory}
            language={language}
            onNavigateToWorkshop={() => setActiveTab('workshop')}
          />
        )}

        {/* VIEW 3: Audition & Consistency Testing Suite */}
        {activeTab === 'audition' && (
          <AuditionSuite
            language={language}
            currentVoiceId={selectedVoiceId}
            onApplyVoice={(voiceId) => {
              setSelectedVoiceId(voiceId);
              setActiveTab('workshop');
            }}
            speed={speed}
            pitch={pitch}
            readingAtmosphere={readingAtmosphere}
          />
        )}

      </main>

      {/* Floating Audio Player Bar */}
      {audioBuffer && (
        <AudioPlayerBar
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          speed={speed}
          pitch={pitch}
          voiceName={activeVoice.name}
          language={language}
          onDownloadMp3={() => handleDownloadStoryMp3(activeStory)}
          isDownloading={isDownloading}
          downloadSuccess={downloadSuccess}
          storyTitle={title}
        />
      )}

      {/* Bedtime Focus Mode Modal */}
      <FocusReaderModal
        isOpen={isFocusMode}
        onClose={() => setIsFocusMode(false)}
        title={title}
        storyText={storyText}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        currentTime={currentTime}
        duration={duration}
        voiceName={activeVoice.name}
        language={language}
        onDownloadMp3={() => handleDownloadStoryMp3(activeStory)}
        isDownloading={isDownloading}
        hasAudio={!!audioBuffer}
        isBedtimeMode={isBedtimeMode}
        setIsBedtimeMode={setIsBedtimeMode}
      />

      {/* Batch Import Stories Modal */}
      <BatchImportModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onImportStories={handleImportStories}
        currentLanguage={language}
      />

    </div>
  );
}

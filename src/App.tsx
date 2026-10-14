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
import { Sparkles, Heart, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState<'workshop' | 'collection' | 'audition'>('workshop');
  const [language, setLanguage] = useState<'en' | 'es'>('en');
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

  const [currentStoryId, setCurrentStoryId] = useState<string>(PRELOADED_STORIES[0].id);

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
  const handleGenerateStoryById = async (targetId: string): Promise<AudioBuffer | null> => {
    const target = stories.find((s) => s.id === targetId);
    if (!target || !target.text.trim()) return null;

    setStories((prev) =>
      prev.map((s) => (s.id === targetId ? { ...s, isGenerating: true, error: null } : s))
    );

    try {
      const stylePrompt =
        target.language === 'es'
          ? `Cuento infantil para niños. Tono dulce, voz suave con registro agudo natural. Pacing calmado y reconfortante.`
          : `Children bedtime storybook narration. Soft, gentle voice with natural higher pitch warmth, measured calming cadence.`;

      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: target.text,
          voice: target.voiceId,
          language: target.language,
          style: stylePrompt,
        }),
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

    setIsBatchGenerating(true);
    setBatchProgress({ current: 0, total: pendingStories.length });

    for (let i = 0; i < pendingStories.length; i++) {
      const s = pendingStories[i];
      setBatchProgress({ current: i + 1, total: pendingStories.length });
      await handleGenerateStoryById(s.id);
    }

    setIsBatchGenerating(false);
    setBatchProgress(null);
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
          .slice(0, 40) + `_${story.voiceId.toLowerCase()}.mp3`;

      downloadMp3(mp3Blob, safeFilename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setErrorMessage('Failed to encode MP3.');
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
      speed: 0.92,
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
      title: language === 'es' ? 'Nuevo Cuento Infantil' : 'New Bedtime Story',
      text: '',
      language,
      voiceId: 'Kore',
      speed: 0.92,
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

  // Update voice on story in collection
  const handleUpdateStoryVoice = (id: string, voiceId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === id ? { ...s, voiceId } : s))
    );
    if (id === currentStoryId) {
      setSelectedVoiceId(voiceId);
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

  // Quick voice preview audition
  const handlePreviewVoice = async (voice: VoiceProfile) => {
    setIsPreviewing(true);
    setPreviewVoiceId(voice.id);
    stopCurrentSource();
    setIsPlaying(false);

    try {
      const sampleText = language === 'es' ? voice.samplePhraseEs : voice.samplePhraseEn;
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sampleText,
          voice: voice.id,
          language,
          style: 'Gentle, soft, clear articulation for children voice audition.',
        }),
      });

      if (!res.ok) throw new Error('Preview synthesis failed.');
      const data = await res.json();
      const arrayBuffer = base64ToArrayBuffer(data.audioBase64);
      const ctx = getAudioContext();
      const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);

      const rendered = await renderProcessedBuffer(decodedBuffer, speed, pitch);
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

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#181614] text-stone-900 dark:text-stone-100 transition-colors duration-200">
      
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: Story Workshop (Editor & Narrator Casting) */}
        {activeTab === 'workshop' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-28">
            <section className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex items-center gap-2 text-xs text-amber-800/80 dark:text-amber-300/80 font-medium">
                <Heart className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-current" />
                <span>
                  {language === 'es'
                    ? 'Estudio de Narración para Cuentos Infantiles y Nanas'
                    : 'Bedtime & Picture Book Storytelling Studio'}
                </span>
                <span aria-hidden="true">·</span>
                <span>{language === 'es' ? 'Solo voz humana natural' : 'Pure natural voice only'}</span>
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
            onDeleteStory={handleDeleteStory}
            onOpenBatchImport={() => setIsBatchModalOpen(true)}
            onAddNewStory={handleAddNewStory}
            onGenerateSingleAudio={(id) => handleGenerateStoryById(id)}
            onGenerateAllPending={handleGenerateAllPending}
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

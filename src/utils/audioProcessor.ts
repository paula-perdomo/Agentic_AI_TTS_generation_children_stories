import { Mp3Encoder } from '@breezystack/lamejs';

// Convert base64 string to an ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert AudioBuffer to MP3 Blob using modern ESM-compatible lamejs encoder
export function audioBufferToMp3(audioBuffer: AudioBuffer, kbps: number = 128): Blob {
  const channels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const numSamples = audioBuffer.length;
  const mp3encoder = new Mp3Encoder(channels, sampleRate, kbps);
  const mp3Data: Uint8Array[] = [];

  if (channels === 1) {
    const floatSamples = audioBuffer.getChannelData(0);
    const int16Samples = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      let s = Math.max(-1, Math.min(1, floatSamples[i]));
      int16Samples[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }

    const sampleBlockSize = 1152;
    for (let i = 0; i < numSamples; i += sampleBlockSize) {
      const chunk = int16Samples.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3encoder.encodeBuffer(chunk);
      if (mp3buf.length > 0) {
        mp3Data.push(new Uint8Array(mp3buf));
      }
    }
  } else {
    // Stereo
    const leftFloat = audioBuffer.getChannelData(0);
    const rightFloat = audioBuffer.getChannelData(1);
    const leftInt16 = new Int16Array(numSamples);
    const rightInt16 = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      let sL = Math.max(-1, Math.min(1, leftFloat[i]));
      let sR = Math.max(-1, Math.min(1, rightFloat[i]));
      leftInt16[i] = sL < 0 ? sL * 0x8000 : sL * 0x7fff;
      rightInt16[i] = sR < 0 ? sR * 0x8000 : sR * 0x7fff;
    }

    const sampleBlockSize = 1152;
    for (let i = 0; i < numSamples; i += sampleBlockSize) {
      const leftChunk = leftInt16.subarray(i, i + sampleBlockSize);
      const rightChunk = rightInt16.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(new Uint8Array(mp3buf));
      }
    }
  }

  const endBuf = mp3encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(new Uint8Array(endBuf));
  }

  return new Blob(mp3Data as unknown as BlobPart[], { type: 'audio/mp3' });
}

// Render an AudioBuffer through an OfflineAudioContext with speed & pitch baked in
export async function renderProcessedBuffer(
  sourceBuffer: AudioBuffer,
  speed: number = 1.0,
  pitchSemitones: number = 0
): Promise<AudioBuffer> {
  const safeSpeed = Math.max(0.5, Math.min(2.0, speed));
  const newDuration = sourceBuffer.duration / safeSpeed;
  const sampleRate = sourceBuffer.sampleRate;
  const frameCount = Math.ceil(newDuration * sampleRate);

  const offlineCtx = new OfflineAudioContext(
    sourceBuffer.numberOfChannels,
    frameCount,
    sampleRate
  );

  const bufferSource = offlineCtx.createBufferSource();
  bufferSource.buffer = sourceBuffer;
  bufferSource.playbackRate.value = safeSpeed;

  // Apply pitch detune in cents (1 semitone = 100 cents)
  if (pitchSemitones !== 0) {
    bufferSource.detune.value = pitchSemitones * 100;
  }

  bufferSource.connect(offlineCtx.destination);
  bufferSource.start(0);

  return await offlineCtx.startRendering();
}

// Download MP3 blob to user's device
export function downloadMp3(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename.endsWith('.mp3') ? filename : `${filename}.mp3`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 2000);
}

declare module '@breezystack/lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, samplerate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }
  export class WavHeader {
    static readHeader(dataView: DataView): {
      channels: number;
      sampleRate: number;
      data_length: number;
      bitDepth: number;
      data_offset: number;
    };
  }
  const lamejs: {
    Mp3Encoder: typeof Mp3Encoder;
    WavHeader: typeof WavHeader;
  };
  export default lamejs;
}

declare module 'lamejs' {
  export class Mp3Encoder {
    constructor(channels: number, samplerate: number, kbps: number);
    encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
    flush(): Int8Array;
  }
  export class WavHeader {
    static readHeader(dataView: DataView): {
      channels: number;
      sampleRate: number;
      data_length: number;
      bitDepth: number;
      data_offset: number;
    };
  }
}

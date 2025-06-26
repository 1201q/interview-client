// interface TranscriberCallbacks {
//   onInterimTranscript: (text: string) => void;
//   onFinalTranscript: (text: string) => void;
//   onError: (error: string) => void;
// }

// export class Transcriber {
//   private ws: WebSocket | null = null;
//   private context: AudioContext | null = null;
//   private workletNode: AudioWorkletNode | null = null;

//   private audioBuffer = new Int16Array(0);

//   private token: string;
//   private sampleRate = 24000;

//   constructor(
//     token: string,
//     private stream: MediaStream,
//     private callbacks: TranscriberCallbacks,
//   ) {
//     this.token = token;
//   }

//   async start() {
//     this.context = new AudioContext({ sampleRate: this.sampleRate });
//     const source = this.context.createMediaStreamSource(this.stream);

//     await this.context.audioWorklet.addModule('/audio-processor.js');

//     this.workletNode = new AudioWorkletNode(this.context, 'audio-processor');
//     this.workletNode.port.onmessage = (e) =>
//       this.handleAudio(e.data.audio_data);

//     source.connect(this.workletNode);
//     this.workletNode.connect(this.context.destination);

//     this.connectWebSocket();
//   }
//   private connectWebSocket() {
//     const ws = new WebSocket(
//       'wss://api.openai.com/v1/realtime?intent=transcription',
//       [
//         'realtime',
//         `openai-insecure-api-key.${this.token}`,
//         'openai-beta.realtime-v1',
//       ],
//     );

//     this.ws = ws;

//     ws.onopen = () => {
//       ws.send(
//         JSON.stringify({
//           type: 'transcription_session.update',
//           session: {
//             input_audio_transcription: {
//               model: 'gpt-4o-transcribe',
//               language: 'ko',
//             },
//             input_audio_format: 'pcm16',
//             turn_detection: {
//               type: 'server_vad',
//               prefix_padding_ms: 300,
//               silence_duration_ms: 200,
//               threshold: 0.5,
//             },
//           },
//         }),
//       );
//     };

//     ws.onmessage = (event) => {
//       const msg = JSON.parse(event.data);
//       if (msg.type === 'conversation.item.input_audio_transcription.partial') {
//         this.callbacks.onInterimTranscript(msg.transcript);
//       } else if (
//         msg.type === 'conversation.item.input_audio_transcription.completed'
//       ) {
//         this.callbacks.onFinalTranscript(msg.transcript);
//       }
//     };

//     ws.onerror = (e) => {
//       console.log(e);
//       this.callbacks.onError('WebSocket 오류 발생');
//     };
//     ws.onclose = () => this.callbacks.onError('WebSocket 연결 종료됨');
//   }

//   private handleAudio(buffer: ArrayBuffer) {
//     const chunk = new Int16Array(buffer as ArrayBuffer);
//     this.audioBuffer = this.concat(this.audioBuffer, chunk);

//     const duration = (this.audioBuffer.length / this.sampleRate) * 1000;
//     if (duration >= 1000) {
//       const frame = this.audioBuffer.subarray(0, this.sampleRate * 0.1);
//       this.audioBuffer = this.audioBuffer.subarray(this.sampleRate * 0.1);

//       const base64 = btoa(String.fromCharCode(...new Uint8Array(frame.buffer)));

//       if (this.ws?.readyState === WebSocket.OPEN) {
//         this.ws.send(
//           JSON.stringify({
//             type: 'input_audio_buffer.append',
//             audio: base64,
//           }),
//         );
//       }
//     }
//   }

//   private concat(a: Int16Array, b: Int16Array) {
//     const result = new Int16Array(a.length + b.length);
//     result.set(a);
//     result.set(b, a.length);
//     return result;
//   }

//   stop() {
//     this.ws?.close();
//     this.workletNode?.disconnect();
//     this.context?.close();
//   }
// }

interface TranscriberCallbacks {
  onInterimTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onError: (error: string) => void;
}

class BufferQueue {
  private chunks: Int16Array[] = [];
  private totalLength = 0;

  enqueue(chunk: Int16Array) {
    if (chunk.length === 0) return;
    this.chunks.push(chunk);
    this.totalLength += chunk.length;
  }

  dequeue(count: number): Int16Array {
    const result = new Int16Array(count);
    let offset = 0;

    while (offset < count && this.chunks.length > 0) {
      const head = this.chunks[0];
      const take = Math.min(head.length, count - offset);
      result.set(head.subarray(0, take), offset);
      offset += take;

      if (take === head.length) {
        this.chunks.shift();
      } else {
        this.chunks[0] = head.subarray(take);
      }
    }

    this.totalLength -= offset;
    return result.subarray(0, offset);
  }

  get length() {
    return this.totalLength;
  }

  clear() {
    this.chunks = [];
    this.totalLength = 0;
  }
}

export class Transcriber {
  private ws: WebSocket | null = null;
  private context: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private buffer = new BufferQueue();
  private sampleRate = 24000;
  private chunkSize = 8192;

  constructor(
    private token: string,
    private stream: MediaStream,
    private callbacks: TranscriberCallbacks,
  ) {}

  async start() {
    this.context = new AudioContext();
    const source = this.context.createMediaStreamSource(this.stream);
    await this.context.audioWorklet.addModule('/audio-processor.js');

    this.workletNode = new AudioWorkletNode(this.context, 'audio-processor');
    this.workletNode.port.onmessage = (e) => {
      const float32 = new Float32Array(e.data.audio_data);
      const downsampled = this.downsampleBuffer(
        float32,
        this.context!.sampleRate,
        this.sampleRate,
      );
      const int16 = this.floatToInt16(downsampled);
      this.buffer.enqueue(int16);

      while (this.buffer.length >= this.chunkSize) {
        const chunk = this.buffer.dequeue(this.chunkSize);
        const base64 = this.toBase64(chunk);
        this.sendChunk(base64);
      }
    };

    source.connect(this.workletNode);
    this.workletNode.connect(this.context.destination);
    this.connectWebSocket();
  }

  private connectWebSocket() {
    const ws = new WebSocket(
      'wss://api.openai.com/v1/realtime?intent=transcription',
      [
        'realtime',
        `openai-insecure-api-key.${this.token}`,
        'openai-beta.realtime-v1',
      ],
    );
    this.ws = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: 'transcription_session.update',
          session: {
            input_audio_transcription: {
              model: 'gpt-4o-transcribe',
              language: 'ko',
            },
            input_audio_format: 'pcm16',
            turn_detection: {
              type: 'server_vad',
              prefix_padding_ms: 300,
              silence_duration_ms: 200,
              threshold: 0.5,
            },
          },
        }),
      );
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'conversation.item.input_audio_transcription.partial') {
        this.callbacks.onInterimTranscript(msg.transcript);
      } else if (
        msg.type === 'conversation.item.input_audio_transcription.completed'
      ) {
        this.callbacks.onFinalTranscript(msg.transcript);
      }
    };

    ws.onerror = () => this.callbacks.onError('WebSocket 오류 발생');
    ws.onclose = () => this.callbacks.onError('WebSocket 연결 종료됨');
  }

  private sendChunk(base64: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: base64,
        }),
      );
    }
  }

  private downsampleBuffer(
    buffer: Float32Array,
    inputRate: number,
    outputRate: number,
  ): Float32Array {
    const ratio = inputRate / outputRate;
    const length = Math.floor(buffer.length / ratio);
    const result = new Float32Array(length);

    for (let i = 0; i < length; i++) {
      const index = i * ratio;
      const before = Math.floor(index);
      const after = Math.ceil(index);
      const weight = index - before;
      result[i] = (1 - weight) * buffer[before] + weight * buffer[after];
    }

    return result;
  }

  private floatToInt16(buffer: Float32Array): Int16Array {
    const result = new Int16Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      result[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return result;
  }

  private toBase64(int16: Int16Array): string {
    const view = new Uint8Array(int16.buffer);
    return btoa(String.fromCharCode(...view));
  }

  stop() {
    this.ws?.close();
    this.workletNode?.disconnect();
    this.context?.close();
    this.buffer.clear();
  }
}

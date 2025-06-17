interface TranscriberCallbacks {
  onInterimTranscript: (text: string) => void;
  onFinalTranscript: (text: string) => void;
  onError: (error: string) => void;
}

export class Transcriber {
  private ws: WebSocket | null = null;
  private context: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;

  private audioBuffer = new Int16Array(0);

  private token: string;
  private sampleRate = 24000;

  constructor(
    token: string,
    private stream: MediaStream,
    private callbacks: TranscriberCallbacks,
  ) {
    this.token = token;
  }

  async start() {
    this.context = new AudioContext({ sampleRate: this.sampleRate });
    const source = this.context.createMediaStreamSource(this.stream);

    await this.context.audioWorklet.addModule('/audio-processor.js');

    this.workletNode = new AudioWorkletNode(this.context, 'audio-processor');
    this.workletNode.port.onmessage = (e) =>
      this.handleAudio(e.data.audio_data);

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
            input_audio_transcription: { model: 'whisper-1', language: 'ko' },
            turn_detection: { type: 'server_vad' },
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

    ws.onerror = (e) => {
      console.log(e);
      this.callbacks.onError('WebSocket 오류 발생');
    };
    ws.onclose = () => this.callbacks.onError('WebSocket 연결 종료됨');
  }

  private handleAudio(buffer: ArrayBuffer) {
    const chunk = new Int16Array(buffer as ArrayBuffer);
    this.audioBuffer = this.concat(this.audioBuffer, chunk);

    const duration = (this.audioBuffer.length / this.sampleRate) * 1000;
    if (duration >= 1000) {
      const frame = this.audioBuffer.subarray(0, this.sampleRate * 0.1);
      this.audioBuffer = this.audioBuffer.subarray(this.sampleRate * 0.1);

      const base64 = btoa(String.fromCharCode(...new Uint8Array(frame.buffer)));

      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(
          JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: base64,
          }),
        );
      }
    }
  }

  private concat(a: Int16Array, b: Int16Array) {
    const result = new Int16Array(a.length + b.length);
    result.set(a);
    result.set(b, a.length);
    return result;
  }

  stop() {
    this.ws?.close();
    this.workletNode?.disconnect();
    this.context?.close();
  }
}

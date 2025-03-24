export class Recorder {
  stream: MediaStream;
  recorder: MediaRecorder | null = null;
  isRecording: boolean = false;
  data: Blob[] = [];
  dataUrl: string = '';

  constructor(stream: MediaStream) {
    this.stream = stream;
  }

  start() {
    this.isRecording = true;
    this.data = [];
    this.dataUrl = '';

    this.recorder = new MediaRecorder(this.stream, {
      mimeType: 'video/webm;codecs=vp9',
    });

    this.recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.data.push(event.data);
      }
    };

    this.recorder.onstop = () => {
      const blob = new Blob(this.data, { type: 'video/webm' });

      this.dataUrl = URL.createObjectURL(blob);
      console.log(URL.createObjectURL(blob));
    };

    this.recorder.start();
  }

  stop() {
    this.isRecording = false;
    this.recorder?.stop();
    this.recorder = null;
  }

  getVideoUrl() {
    return this.dataUrl;
  }
}

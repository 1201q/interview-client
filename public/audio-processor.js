// class PCMProcessor extends AudioWorkletProcessor {
//   constructor() {
//     super();
//     this.buffer = [];
//   }

//   process(inputs) {
//     const input = inputs[0];
//     if (!input || !input[0]) return true;

//     const samples = input[0];
//     const pcm16 = new Int16Array(samples.length);

//     for (let i = 0; i < samples.length; i++) {
//       let s = Math.max(-1, Math.min(1, samples[i]));
//       pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
//     }

//     this.port.postMessage({ audio_data: pcm16.buffer }, [pcm16.buffer]);
//     return true;
//   }
// }

// registerProcessor('audio-processor', PCMProcessor);

class PCMWorklet extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const float32 = input[0];
    this.port.postMessage({ audio_data: float32.buffer }, [float32.buffer]);
    return true;
  }
}

registerProcessor('audio-processor', PCMWorklet);

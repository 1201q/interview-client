export function bindTrack(
  stream: MediaStream | null,
  opts: {
    onEnded: () => void;
    onMute: () => void;
    onUnmute: () => void;
  },
) {
  const cleaners: (() => void)[] = [];

  const track = stream?.getVideoTracks()[0];

  if (track) {
    const onended = () => opts.onEnded();
    const onmute = () => opts.onMute();
    const onunmute = () => opts.onUnmute();

    track.addEventListener('ended', onended);
    track.addEventListener('mute', onmute);
    track.addEventListener('unmute', onunmute);

    cleaners.push(() => {
      track.removeEventListener('ended', onended);
      track.removeEventListener('mute', onmute);
      track.removeEventListener('unmute', onunmute);
    });

    return () => {
      cleaners.forEach((clean) => clean());
    };
  }
}

export function bindDeviceChange(onChange: () => void) {
  if (!navigator.mediaDevices?.addEventListener) return () => {};

  const handler = () => onChange();

  navigator.mediaDevices.addEventListener('devicechange', handler);

  return () =>
    navigator.mediaDevices.removeEventListener('devicechange', handler);
}

export async function bindPermissionChange(
  onState: (state: PermissionState, kind: 'camera' | 'microphone') => void,
) {
  if (!('permissions' in navigator)) return () => {};

  const removers: (() => void)[] = [];

  async function attach(name: PermissionName, kind: 'camera' | 'microphone') {
    try {
      const p = await navigator.permissions.query({ name });
      const handler = () => onState(p.state, kind);

      p.addEventListener('change', handler);

      removers.push(() => p.removeEventListener('change', handler));

      onState(p.state, kind);
    } catch (error) {
      console.error('Permission API error:', error);
    }
  }

  await attach('camera', 'camera');

  await attach('microphone', 'microphone');

  return () => removers.forEach((remove) => remove());
}

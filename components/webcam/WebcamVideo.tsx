import React, { forwardRef, ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'video'>;

const WebcamVideo = forwardRef<HTMLVideoElement, Props>((props, ref) => {
  return <video playsInline autoPlay {...props} ref={ref} />;
});

WebcamVideo.displayName = 'WebcamVideo';

export default WebcamVideo;

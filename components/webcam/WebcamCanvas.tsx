import React, { forwardRef, Ref, ComponentPropsWithRef } from 'react';

type Props = ComponentPropsWithRef<'canvas'>;

const WebcamCanvas = (
  { ...attributes }: Props,
  ref: Ref<HTMLCanvasElement>,
) => {
  return <canvas {...attributes} ref={ref} />;
};

export default forwardRef(WebcamCanvas);

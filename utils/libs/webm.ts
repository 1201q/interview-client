import { Decoder, Encoder, tools } from 'ts-ebml';

export const getWebmWithDuration = async (blob: Blob) => {
  const buffer = await blob.arrayBuffer();
  const decoder = new Decoder();
  const elms = decoder.decode(buffer);
};

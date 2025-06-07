import { atom } from 'jotai';

interface FileItem {
  file: File;
  loading: boolean;
  text: string;
}

export const uploadedFileAtom = atom<FileItem | null>(null);

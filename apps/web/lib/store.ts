import { create } from 'zustand';

interface EditorState {
  uploadedImage: string | null;
  setUploadedImage: (image: string | null) => void;
  generatedCaption: string;
  setGeneratedCaption: (caption: string) => void;
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  uploadedImage: null,
  setUploadedImage: (image) => set({ uploadedImage: image }),
  generatedCaption: '',
  setGeneratedCaption: (caption) => set({ generatedCaption: caption }),
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  reset: () => set({ uploadedImage: null, generatedCaption: '', isGenerating: false }),
}));

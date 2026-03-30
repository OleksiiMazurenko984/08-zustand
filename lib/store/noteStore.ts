import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { NoteData } from '@/types/note';

interface NoteDraft {
  draft: NoteData;
  setDraft: (newNoteData: NoteData) => void;
  clearDraft: () => void;
}

export const initialDraft: NoteData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraft>()(
  persist(
    set => {
      return {
        draft: initialDraft,
        setDraft: newDraft => {
          set({
            draft: newDraft,
          });
        },
        clearDraft: () => {
          set({
            draft: initialDraft,
          });
        },
      };
    },
    {
      name: 'note-draft',
      partialize: state => ({ draft: state.draft }),
    }
  )
);

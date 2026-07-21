import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "ta" | "en";

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "ta",
      setLanguage: (lang) => set({ language: lang }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === "ta" ? "en" : "ta" })),
    }),
    {
      name: "worship-poll-language",
    }
  )
);

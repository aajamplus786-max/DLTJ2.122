// =====================================================
// DLTJ2.1
// WORKING TOOL — BATCH 5
// FILE: src/components/workingTools/language/EditorAutocomplete.tsx
// =====================================================

import {
    useEffect,
    useMemo,
    useState,
  } from "react";
  
  
  
  import {
    getCompletionItems,
    getCurrentWord,
  } from "../../../services/language/completionService";
  
  import type { SupportedLanguage } from "../../../services/language/languageService";
  
  import EditorSuggestions from "./EditorSuggestions";
  
  interface EditorAutocompleteProps {
    value: string;
    cursorPosition: number;
    language: SupportedLanguage;
    onInsert: (
      text: string,
      replaceLength: number,
    ) => void;
  }
  
  export default function EditorAutocomplete({
    value,
    cursorPosition,
    language,
    onInsert,
  }: EditorAutocompleteProps) {
    const [visible, setVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
  
    const currentWord = useMemo(
      () => getCurrentWord(value, cursorPosition),
      [value, cursorPosition],
    );
  
    const suggestions = useMemo(
      () =>
        getCompletionItems(
          language,
          currentWord,
        ),
      [language, currentWord],
    );
  
    useEffect(() => {
      if (currentWord.length > 0 && suggestions.length > 0) {
        setVisible(true);
        setSelectedIndex(0);
      } else {
        setVisible(false);
      }
    }, [currentWord, suggestions]);
  
    useEffect(() => {
      const handleKeyboard = (event: KeyboardEvent) => {
        if (!visible || suggestions.length === 0) {
          return;
        }
  
        if (event.key === "ArrowDown") {
          event.preventDefault();
  
          setSelectedIndex((current) =>
            Math.min(
              current + 1,
              suggestions.length - 1,
            ),
          );
        }
  
        if (event.key === "ArrowUp") {
          event.preventDefault();
  
          setSelectedIndex((current) =>
            Math.max(current - 1, 0),
          );
        }
  
        if (
          event.key === "Enter" ||
          event.key === "Tab"
        ) {
          event.preventDefault();
  
          const item =
            suggestions[selectedIndex];
  
          if (item) {
            onInsert(
              item.insertText ?? item.label,
              currentWord.length,
            );
  
            setVisible(false);
          }
        }
  
        if (event.key === "Escape") {
          setVisible(false);
        }
      };
  
      window.addEventListener(
        "keydown",
        handleKeyboard,
      );
  
      return () => {
        window.removeEventListener(
          "keydown",
          handleKeyboard,
        );
      };
    }, [
      currentWord,
      onInsert,
      selectedIndex,
      suggestions,
      visible,
    ]);
  
    if (!visible) {
      return null;
    }
  
    return (
      <EditorSuggestions
        items={suggestions}
        selectedIndex={selectedIndex}
        onSelect={(item) => {
          onInsert(
            item.insertText ?? item.label,
            currentWord.length,
          );
  
          setVisible(false);
        }}
      />
    );
  }
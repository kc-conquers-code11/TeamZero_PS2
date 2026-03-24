import React, { createContext, useContext, useEffect, useState } from 'react';

type AccessibilityState = {
    textSize: number;
    invert: boolean;
    grayscale: boolean;
    highlightLinks: boolean;
    bigCursor: boolean;
    dyslexicFont: boolean;
    hideImages: boolean;
};

const defaultState: AccessibilityState = {
    textSize: 100,
    invert: false,
    grayscale: false,
    highlightLinks: false,
    bigCursor: false,
    dyslexicFont: false,
    hideImages: false,
};

type AccessibilityContextType = AccessibilityState & {
    setTextSize: (size: number) => void;
    toggleInvert: () => void;
    toggleGrayscale: () => void;
    toggleHighlightLinks: () => void;
    toggleBigCursor: () => void;
    toggleDyslexicFont: () => void;
    toggleHideImages: () => void;
    reset: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AccessibilityState>(() => {
        const saved = localStorage.getItem('tb_access');
        return saved ? JSON.parse(saved) : defaultState;
    });

    useEffect(() => {
        localStorage.setItem('tb_access', JSON.stringify(state));

        // Apply classes to document root
        const root = document.documentElement;
        root.style.fontSize = `${state.textSize}%`;

        root.classList.toggle('access-invert', state.invert);
        root.classList.toggle('access-grayscale', state.grayscale);
        root.classList.toggle('access-highlight-links', state.highlightLinks);
        root.classList.toggle('access-big-cursor', state.bigCursor);
        root.classList.toggle('access-dyslexic', state.dyslexicFont);
        root.classList.toggle('access-hide-images', state.hideImages);
    }, [state]);

    const setTextSize = (size: number) => setState(s => ({ ...s, textSize: Math.min(Math.max(size, 80), 150) }));
    const toggleInvert = () => setState(s => ({ ...s, invert: !s.invert }));
    const toggleGrayscale = () => setState(s => ({ ...s, grayscale: !s.grayscale }));
    const toggleHighlightLinks = () => setState(s => ({ ...s, highlightLinks: !s.highlightLinks }));
    const toggleBigCursor = () => setState(s => ({ ...s, bigCursor: !s.bigCursor }));
    const toggleDyslexicFont = () => setState(s => ({ ...s, dyslexicFont: !s.dyslexicFont }));
    const toggleHideImages = () => setState(s => ({ ...s, hideImages: !s.hideImages }));
    const reset = () => setState(defaultState);

    return (
        <AccessibilityContext.Provider value={{
            ...state,
            setTextSize,
            toggleInvert,
            toggleGrayscale,
            toggleHighlightLinks,
            toggleBigCursor,
            toggleDyslexicFont,
            toggleHideImages,
            reset
        }}>
            {children}
        </AccessibilityContext.Provider>
    );
}

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) throw new Error('useAccessibility must be used within AccessibilityProvider');
    return context;
};

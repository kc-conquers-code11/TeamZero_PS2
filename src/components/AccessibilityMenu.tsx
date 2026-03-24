import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, RotateCcw, Minus, Plus, Eye, Moon, MousePointer2, Type, ImageIcon, Link2, X } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { Button } from './ui/button';
import { useAccessibility } from './AccessibilityProvider';

export function AccessibilityMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();
    const {
        textSize, setTextSize,
        invert, toggleInvert,
        grayscale, toggleGrayscale,
        highlightLinks, toggleHighlightLinks,
        bigCursor, toggleBigCursor,
        dyslexicFont, toggleDyslexicFont,
        hideImages, toggleHideImages,
        reset
    } = useAccessibility();

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full shadow-2xl bg-accent hover:bg-accent/90 border-4 border-white no-highlight"
                size="icon"
            >
                <Accessibility className="w-8 h-8 text-white" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-accent p-5 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Accessibility className="w-5 h-5 text-primary" />
                                <h3 className="font-bold text-base uppercase tracking-wider">{t('accessibility')}</h3>
                            </div>
                            <button
                                onClick={reset}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-all border border-white/20 no-highlight"
                            >
                                <RotateCcw className="w-3 h-3" /> {t('reset')}
                            </button>
                        </div>

                        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar text-left">
                            {/* Text Size */}
                            <section>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">{t('textSize')}</label>
                                <div className="flex items-center justify-between bg-muted/30 p-2 rounded-xl border border-border/40">
                                    <Button
                                        variant="ghost" size="icon" className="h-10 w-10 text-accent font-black hover:bg-white shadow-sm transition-all"
                                        onClick={() => setTextSize(textSize - 10)}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="font-black text-accent text-lg">{textSize}%</span>
                                    <Button
                                        variant="ghost" size="icon" className="h-10 w-10 text-accent font-black hover:bg-white shadow-sm transition-all"
                                        onClick={() => setTextSize(textSize + 10)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                            </section>

                            {/* Display Filters */}
                            <section>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">{t('displayOptions')}</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <AccessButton
                                        active={invert}
                                        onClick={toggleInvert}
                                        icon={Moon}
                                        label={t('invertColors')}
                                    />
                                    <AccessButton
                                        active={grayscale}
                                        onClick={toggleGrayscale}
                                        icon={Eye}
                                        label={t('grayscale')}
                                    />
                                </div>
                            </section>

                            {/* Reading Tools */}
                            <section>
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4 block">{t('readingTools')}</label>
                                <div className="space-y-3">
                                    <AccessListButton
                                        active={highlightLinks}
                                        onClick={toggleHighlightLinks}
                                        icon={Link2}
                                        label={t('highlightLinks')}
                                    />
                                    <AccessListButton
                                        active={bigCursor}
                                        onClick={toggleBigCursor}
                                        icon={MousePointer2}
                                        label={t('bigCursor')}
                                    />
                                    <AccessListButton
                                        active={dyslexicFont}
                                        onClick={toggleDyslexicFont}
                                        icon={Type}
                                        label={t('dyslexiaFriendly')}
                                    />
                                    <AccessListButton
                                        active={hideImages}
                                        onClick={toggleHideImages}
                                        icon={ImageIcon}
                                        label={t('hideImages')}
                                    />
                                </div>
                            </section>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function AccessButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-3 ${active
                ? 'border-primary bg-primary/5 shadow-inner'
                : 'border-border/40 hover:border-primary/20 bg-background'
                }`}
        >
            <Icon className={`w-6 h-6 ${active ? 'text-primary' : 'text-accent'}`} />
            <span className="text-[10px] font-bold text-accent text-center uppercase leading-tight tracking-tight">{label}</span>
        </button>
    );
}

function AccessListButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${active
                ? 'border-primary bg-primary/5 shadow-inner'
                : 'border-border/40 hover:border-primary/20 bg-background'
                }`}
        >
            <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${active ? 'bg-primary text-white' : 'bg-muted text-accent'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-accent uppercase tracking-wide">{label}</span>
            </div>
            <div className={`w-3 h-3 rounded-full border-2 ${active ? 'bg-primary border-primary animate-pulse' : 'border-border'}`} />
        </button>
    );
}

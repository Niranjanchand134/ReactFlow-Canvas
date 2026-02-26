import { useEffect } from 'react';

interface KeyboardShortcutProps {
    onUndo: () => void;
    onRedo: () => void;
    onCopy: () => void;
    onPaste: () => void;
    onSelectAll: () => void;
}

export const useKeyboardShortcuts = ({
    onUndo,
    onRedo,
    onCopy,
    onPaste,
    onSelectAll,
}: KeyboardShortcutProps) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if the user is typing in an input or textarea
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                return;
            }

            const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
            const modifier = isMac ? event.metaKey : event.ctrlKey;

            if (!modifier) return;

            switch (event.key.toLowerCase()) {
                case 'z':
                    event.preventDefault();
                    if (event.shiftKey) {
                        onRedo();
                    } else {
                        onUndo();
                    }
                    break;
                case 'y':
                    event.preventDefault();
                    onRedo();
                    break;
                case 'c':
                    event.preventDefault();
                    onCopy();
                    break;
                case 'v':
                    event.preventDefault();
                    onPaste();
                    break;
                case 'a':
                    event.preventDefault();
                    onSelectAll();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onUndo, onRedo, onCopy, onPaste, onSelectAll]);
};

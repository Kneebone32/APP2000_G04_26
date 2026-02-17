import { useState } from 'react';

//Hook for Modal. Laget av Kay
export function useModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [key, setKey] = useState(0);

    const open = () => {
        setKey(prev => prev + 1);
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
    };

    return { isOpen, key, open, close };
}
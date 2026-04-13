import { useEffect } from "react";

// Hook for å håndtere bildeopplasting med Simple File Upload. Laget av Olai.
// trigger-prop brukes for å re-kjøre effekten når opplasteren vises/skjules
export function useFileUpload(setBildeUrl, trigger) {
    useEffect(() => {
        const uploader = document.querySelector('simple-file-upload');
        if (!uploader) return;
        const handleUpload = (event) => {
            const files = event.detail?.files ?? event.detail?.allFiles;
            if (files && files.length > 0) {
                const uploadedUrls = files.map(file => file.url || file.cdnUrl);
                setBildeUrl(uploadedUrls);
            }
        };
        uploader.addEventListener('change', handleUpload);
        return () => uploader.removeEventListener('change', handleUpload);
    }, [setBildeUrl, trigger]);
}

import { useEffect } from "react";

// Hook for å håndtere bildeopplasting med Simple File Upload. Laget av Olai.
export function useFileUpload(setBildeUrl) {
    useEffect(() => {
        const uploader = document.querySelector('simple-file-upload');
        if (uploader) {
            const handleUpload = (event) => {
                const files = event.detail.allFiles;
                if (files && files.length > 0) {
                    const uploadedUrls = files.map(file => file.cdnUrl || file.url);
                    setBildeUrl(uploadedUrls);
                }
            };
            uploader.addEventListener('change', handleUpload);
            return () => uploader.removeEventListener('change', handleUpload);
        }
    }, [setBildeUrl]);
}

import { useEffect } from "react";

// Hook for å håndtere bildeopplasting med Simple File Upload
export function useFileUpload(setBildeUrl) {
    useEffect(() => {
        const uploader = document.querySelector('simple-file-upload');
        if (uploader) {
            const handleUpload = (event) => {
                const files = event.detail.allFiles;
                if (files && files.length > 0) {
                    const uploadedUrl = files[0].cdnUrl || files[0].url;
                    setBildeUrl(uploadedUrl);
                }
            };
            uploader.addEventListener('change', handleUpload);
            return () => uploader.removeEventListener('change', handleUpload);
        }
    }, [setBildeUrl]);
}

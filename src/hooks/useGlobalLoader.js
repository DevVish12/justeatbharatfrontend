// Usage: import { useGlobalLoader } from "@/context/GlobalLoaderContext";
// Call showLoader("Message") to show, hideLoader() to hide.

import { useGlobalLoader } from "@/context/GlobalLoaderContext";

export function useShowGlobalLoader() {
    const { showLoader, hideLoader } = useGlobalLoader();
    return { showLoader, hideLoader };
}

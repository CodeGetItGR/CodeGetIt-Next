"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {useCallback, useMemo} from "react";

export function useNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    /**
     * Navigate to the given route. 
     * If options.replace is true, it will replace the current entry in the history stack instead of adding a new one.
     */
    const navigate = useCallback((href: string, 
      options : {
        replace:boolean
        preserveFrom?: boolean;
    }) => {
        const destination = options.preserveFrom ? `${href}?from=${encodeURIComponent(pathname)}` : href;
        if(options.replace) {
            router.replace(destination);
        } else {
            router.push(destination);
        }
    },[pathname, router])

    /**
     * Go back an entry in the history.
     */
    const goBack = useCallback(() =>  {
       router.back() 
    },[router])

    /**
     * Refresh the current page.
     */
    const refresh = useCallback(() => {
        router.refresh();
    },[router])

    return useMemo(() => ({
        location: pathname,
        searchParams,
        navigate,
        goBack,
        refresh,
    }), [goBack, navigate, pathname, refresh, searchParams]);
}
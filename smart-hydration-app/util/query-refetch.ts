/* eslint-disable react-hooks/exhaustive-deps */
import { Atom, useAtomValue } from "jotai";
import { AtomWithQueryResult } from "jotai-tanstack-query";
import { useEffect, useState } from "react";

export function useQueryRefetch(queryAtom: Atom<AtomWithQueryResult>) {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { refetch, isFetching } = useAtomValue(queryAtom);

    console.log(refetch);

    const handleRefresh = () => {
        setIsRefreshing(true);
        refetch();
    };

    useEffect(() => {
        if (!isFetching && isRefreshing) {
            setIsRefreshing(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFetching, isRefreshing]);

    return { isRefreshing, handleRefresh };
}

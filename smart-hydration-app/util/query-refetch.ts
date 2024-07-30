import { Atom, useAtomValue } from "jotai";
import { AtomWithQueryResult } from "jotai-tanstack-query";
import { useEffect, useState } from "react";

export function useQueryRefetch(queryAtom: Atom<AtomWithQueryResult>) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { refetch, isFetching } = useAtomValue(queryAtom);
    console.log(isFetching);
    const handleRefresh = () => {
        setIsRefreshing(true);
        refetch();
    };

    useEffect(() => {
        if (!isFetching && isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isFetching]);

    return { isRefreshing, handleRefresh };
}

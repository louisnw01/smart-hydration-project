import { useQueryRefetch } from "@/util/query-refetch";
import { Atom } from "jotai";
import { AtomWithQueryResult } from "jotai-tanstack-query";
import { RefreshControl, ScrollView, View } from "react-native";
import Loading from "./loading";

export default function PageWrapper({
    children,
    isLoading,
    message,
    className,
}: {
    children: JSX.Element | JSX.Element[];
    isLoading?: boolean;
    message?: string;
    className?: string;
}) {
    if (isLoading) return <Loading isLoading message={message} />;
    return (
        <View className={`flex flex-1 dark:bg-black ${className}`}>
            {children}
        </View>
    );
}

export function ScrollPageWrapper({
    children,
    isLoading,
    message,
    className,
    queryRefreshAtom,
}: {
    children: JSX.Element | JSX.Element[];
    isLoading?: boolean;
    message?: string;
    className?: string;
    queryRefreshAtom?: Atom<AtomWithQueryResult>;
}) {
    const { isRefreshing, handleRefresh } = queryRefreshAtom
        ? useQueryRefetch(queryRefreshAtom)
        : { isRefreshing: undefined, handleRefresh: undefined };

    if (isLoading) return <Loading isLoading message={message} />;

    return (
        <ScrollView
            contentContainerClassName={className}
            refreshControl={
                <RefreshControl
                    refreshing={isRefreshing || false}
                    onRefresh={handleRefresh}
                />
            }
        >
            {children}
        </ScrollView>
    );
}

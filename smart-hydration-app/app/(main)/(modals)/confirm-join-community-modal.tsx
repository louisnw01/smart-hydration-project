import { communityNameQAtom, joinCommunityMAtom } from "@/atom/query";
import { inviteCodeAtom } from "@/atom/user";
import StyledButton from "@/components/common/button";
import Loading from "@/components/common/loading";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function ConfirmJoinCommunityModal() {
    const [inviteCode, setInviteCode] = useAtom(inviteCodeAtom);
    const verificationUrl = Linking.useURL();
    const { error, data, isLoading, refetch } =
        useAtomValue(communityNameQAtom);
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [disabled, setDisabled] = useState(true);
    const {
        mutate,
        isSuccess,
        error: mutateError,
    } = useAtomValue(joinCommunityMAtom);

    useEffect(() => {
        setInviteCode("");
        if (!inviteCode && verificationUrl) {
            setInviteCode(verificationUrl?.slice(-10) ?? "");
        }
    }, [verificationUrl]);

    useEffect(() => {
        if (inviteCode) {
            refetch();
        }
    }, [inviteCode]);

    useEffect(() => {
        if (error) {
            setDisabled(true);
            setErrorMessage(error.message);
            setInviteCode("");
            return;
        }
        if (data) {
            setDisabled(false);
            setErrorMessage("");
            setName(data);
        }
    }, [error, data]);

    useEffect(() => {
        if (mutateError) {
            setDisabled(true);
            setErrorMessage(mutateError.message);
            return;
        } else if (isSuccess) {
            setDisabled(false);
            setErrorMessage("");
            setInviteCode("");
            router.replace("(tabs)/community");
        }
    }, [isSuccess, mutateError]);

    return (
        <View className="mt-8 flex gap-6 mx-6">
            <Loading isLoading={isLoading} message="Verifying link.." />
            {data && (
                <Text className="text-xl font-light text-center dark:text-white">
                    Are you sure you want to join the {name} community?
                </Text>
            )}
            {errorMessage && (
                <Text className="text-xl font-light text-center text-red">
                    {errorMessage}
                </Text>
            )}
            {!errorMessage && (
                <StyledButton
                    text="Join"
                    buttonClass="bg-green self-center rounded-xl"
                    textClass="text-white text-lg font-semibold"
                    disabled={disabled}
                    onPress={() => mutate()}
                />
            )}
            <StyledButton
                text={error ? "Back" : "Cancel"}
                buttonClass="bg-red self-center rounded-xl"
                textClass="text-white text-lg font-semibold"
                onPress={() => {
                    if (router.canGoBack()) router.back();
                    else router.replace("(modals)/join-community-modal");
                }}
            />
        </View>
    );
}

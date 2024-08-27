import "../global.css";

import { registerForPushNotificationsAsync } from "@/util/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { router, Slot } from "expo-router";
import { deleteItemAsync } from "expo-secure-store";
import { Provider } from "jotai";
import { queryClientAtom } from "jotai-tanstack-query";
import { useHydrateAtoms } from "jotai/react/utils";
import { useEffect, useRef, useState } from "react";
import { PermissionsAndroid, Platform } from "react-native";

const queryClient = new QueryClient();

const HydrateAtoms = ({ children }: { children: React.ReactNode }) => {
    useHydrateAtoms([[queryClientAtom, queryClient]]);
    return children;
};

// Add this function to the top of wrappedIndex for one run if needed
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function clearStorage() {
    await deleteItemAsync("color-scheme");
    await deleteItemAsync("auth-token");
}

async function getAndriodPermissions() {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
            title: "Location permission is required for WiFi connections",
            message:
                "This app needs location permission as this is required  " +
                "to scan for wifi networks.",
            buttonNegative: "DENY",
            buttonPositive: "ALLOW",
        },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // You can now use react-native-wifi-reborn
    } else {
        // Permission denied
    }
}

export default function Index() {
    console.log("INDEX");
    //clearStorage();
    if (Platform.OS == "android") getAndriodPermissions();
    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >(undefined);
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then((token) => setExpoPushToken(token ?? ""))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        // responseListener.current =
        //     Notifications.addNotificationResponseReceivedListener(
        //         (response) => {
        //             // for linking from notifications when app is foregrounded or backgrounded
        //             const { screen } =
        //                 response.notification.request.content.data;
        //             if (screen) {
        //                 router.replace(screen);
        //             }
        //         },
        //     );

        // for linking from notifications when app is killed
        // Linking.addEventListener("url", ({ url }) => {
        //     router.push(url);
        // });

        return () => {
            notificationListener.current &&
                Notifications.removeNotificationSubscription(
                    notificationListener.current,
                );
            responseListener.current &&
                Notifications.removeNotificationSubscription(
                    responseListener.current,
                );
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Provider>
                <HydrateAtoms>
                    <Slot />
                </HydrateAtoms>
            </Provider>
        </QueryClientProvider>
    );
}

import NavigationBar from "@/components/nav";
import "../global.css"
import { View } from 'react-native';
import PageRouter from "@/components/page-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAtomValue, useSetAtom } from "jotai";
import { authTokenAtom, isLoggedInAtom } from "@/atom/user";
import OnboardingRouter from "@/components/onboarding-router";

import { Provider } from 'jotai/react'
import { useHydrateAtoms } from 'jotai/react/utils'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { queryClientAtom } from 'jotai-tanstack-query'

const queryClient = new QueryClient()

const HydrateAtoms = ({ children }) => {
  useHydrateAtoms([[queryClientAtom, queryClient]])
  return children
}

export default function Index() {
    // const setAuthToken = useSetAtom(authTokenAtom);
    // setAuthToken(null);
    const isLoggedIn = useAtomValue(isLoggedInAtom);

    if (!isLoggedIn) {
        return <OnboardingRouter />
    }

    return (
        <QueryClientProvider client={queryClient}>
        <Provider>
          <HydrateAtoms>
            <GestureHandlerRootView>
                <View className="flex flex-1 justify-between h-full">
                    <PageRouter />
                    <NavigationBar />
                </View>
            </GestureHandlerRootView>
          </HydrateAtoms>
        </Provider>
      </QueryClientProvider>
    );

}

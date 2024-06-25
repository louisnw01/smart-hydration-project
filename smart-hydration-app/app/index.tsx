import NavigationBar from "@/components/nav";
import "../global.css"
import { View } from 'react-native';
import PageRouter from "@/components/page-router";
import {GestureHandlerRootView} from "react-native-gesture-handler";
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

import { View, Pressable, Text } from "react-native";
import PageWrapper from "../common/page-wrapper";
import Drop from "../../assets/svgs/water-drop-svgrepo-com.svg";
import { useSetAtom } from "jotai";
import { onboardingRouterAtom } from "../onboarding-router";

export default function LoginRegister() {
    const setPage = useSetAtom(onboardingRouterAtom)
    return (
        <PageWrapper>
            <View className="flex mt-20 gap-32">
                <View className='items-center gap-14'>
                    <Text className='text-4xl font-bold'>Smart Hydration</Text>
                    <Drop width={100} height={100} />
                </View>
                <View className='items-center gap-4'>
                    <Pressable onPress={()=>setPage('login')} className="bg-blue px-2 py-2 rounded-lg w-32"><Text className="text-white text-2xl font-semibold text-center">Login</Text></Pressable>
                    <Pressable onPress={()=>setPage('register')} className="bg-blue px-2 py-2 rounded-lg w-32"><Text className="text-white text-2xl font-semibold text-center">Register</Text></Pressable>
                </View>
            </View>
        </PageWrapper>
    )
}

 // <PageWrapper>
 //            <View className='bg-gray-100 p-10 h-screen block'>
 //                <PageProgressBar currentPage={pageIndex + 1} totalPages={pages.length}></PageProgressBar>
 //                <View className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'></View>
 //                <View className='items-center justify-center p-9 space-y-7 md:space-y-9 sm:p-8'>
 //                    <>
 //                        {pageIndex === 0 &&
 //                            <View className="flex gap-6">
 //                                <Text className='text-4xl font-bold'>Smart Hydration</Text>
 //                                <View className="flex flex-row justify-center">
 //                                    <Drop width={100} height={100} />
 //                                </View>
 //                            </View>
 //                        }
 //                    </>
 //                    <View>
 //                        <GenericOnboardContent title={currentPageContent.title}>
 //                            {currentPageContent.content}
 //                        </GenericOnboardContent>
 //                    </View>
 //                </View>
 //            </View>
 //            <>{pageIndex < maxPageIndex - 1 && <NextButton onPress={handleNext} />}</>
 //            <>{pageIndex === maxPageIndex - 1 && <SubmitButton onPress={handleSubmit} />}</>
 //            <>{pageIndex > 0 && <BackButton onPress={handleBack} />}</>
 //            <>{currentPageContent.skippable != 0 && <SkipButton onPress={handleSkip} />}</>
 //        </PageWrapper>
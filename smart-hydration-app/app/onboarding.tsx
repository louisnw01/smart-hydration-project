
import { View, Text } from "react-native";
import { atom, useAtom } from "jotai";
import GenericOnboardContent from "@/components/generic-onboard-content";
import NextButton from "@/components/next-button";
import SubmitButton from "@/components/submit-button";
import TextInputBox from "@/components/text-input-box";
import Drop from "../assets/svgs/water-drop-svgrepo-com.svg"
import PageWrapper from "@/components/common/page-wrapper";
import { SelectInputBox } from "@/components/select-input-box";


export const currentPageAtom = atom('home');
export const pageIndexAtom = atom(0);

export default function OnboardingPage( {}){
  const [pageIndex, setPageIndex] = useAtom(pageIndexAtom);



  //replace content with components e.g. TextInput with props for specific text like "Enter your name"
  const pages = [
    {
      title: 'What is your name?',
      content:
      <View>
      <TextInputBox name="username" placeholder='Enter your name' />
      </View>
    },
    {
      title: 'What is your age?',
      content: <Text>Placeholder for age page content</Text>,
    },
    {
      title: 'What is your height?',
      content: <Text>Placeholder for height page content</Text>,
    },
    {
      title: 'What is your medication?',
      content: <>
        <Text>Placeholder for height page content</Text>
        <SelectInputBox multiple={false} />
      </>,
    }

  ]

  const currentPageContent = pages[pageIndex];

  const maxPageIndex = pages.length;

  const handleNext = () => {
    setPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
  };

  const handleSubmit = () => {
   //do nothing for now
   //later, go to homepage
  };

  const CurrentPage = pages[pageIndex];
  return (

      <PageWrapper>
        <View className='bg-gray-100 p-10 h-screen block'>
          <View className='flex flex-col flex-1 items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'></View>
                  <View className='items-center justify-center p-9 space-y-7 md:space-y-9 sm:p-8'>
      <>{pageIndex === 0 && <Text className='text-4xl font-bold text-gray-2000 md:text-2xl text-nowrap ... '>Smart Hydration</Text>}</>
      <View>
      <>{pageIndex === 0 && <View className="flex flex-row justify-center mb-2 sm:mb-4">
                    <Drop width={100} height={100}/>
              </View>}</>
      <GenericOnboardContent title={currentPageContent.title}>
      {currentPageContent.content}
      </GenericOnboardContent>
      </View>
      </View>
      </View>
      <>{pageIndex < maxPageIndex - 1 && <NextButton onPress={handleNext} />}</>
      <>{pageIndex === maxPageIndex - 1 && <SubmitButton onPress={handleSubmit} />}</>


    </PageWrapper>


  )
}


//Don't know how to style the components properly

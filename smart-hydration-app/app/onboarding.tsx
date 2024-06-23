
import { View, Text } from "react-native";
import { atom, useAtom } from "jotai";
import GenericOnboardContent from "@/components/generic-onboard-content";
import NextButton from "@/components/next-button";
import SubmitButton from "@/components/submit-button";
import TextInputBox from "@/components/text-input-box";
import NumberInputBox from "@/components/number-input-box";
import RadioButton from "@/components/radio-button";
import Checkbox from "@/components/checkbox";
import Drop from "../assets/svgs/water-drop-svgrepo-com.svg"
import PageWrapper from "@/components/common/page-wrapper";
import PageProgressBar from "@/components/page-progress-bar";
import BackButton from "@/components/back-button";
import SkipButton from "@/components/skip-button";

export const currentPageAtom = atom('home');
export const pageIndexAtom = atom(0);

export default function OnboardingPage( {} ){
  const [pageIndex, setPageIndex] = useAtom(pageIndexAtom);
  const sexOptions = ['Female', 'Male', 'Prefer not to say'];
  const binaryOptions = ['Yes', 'No'];
  const measureOptions = ['Metric', 'Imperial'];

  const pages = [
    {
    title: 'Login screen',
      content: <Text>Placeholder for Jasmine's login screen</Text>,
      skippable: 0, //not skippable: 0, skippable: 1
    },
    {
      title: 'Do you consent to the collection of personal health information?',
      content: 
      <View>
      {/* To do: make this text scrollable (will be longer than a single page) */}
      <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, pariatur. Excepteur sint  occaecat cupidatat non proident, sunt in culpa qui officia deserunt  mollit anim id est laborum. </Text>
      <Checkbox text='I consent' />
      </View>,
      skippable: 0,
    },
    {
      title: 'What is your date of birth?',
      content: <View>
      <TextInputBox name="dob" placeholder='dd-mm-yyyy' />
      </View>,
      skippable: 0,
    },
    {
      title: 'Do you have a Smart Hydation jug?',
      content: <View>
      <RadioButton options={binaryOptions} defaultString='No' />
      {/* This screen TBD: are we scanning QR code? */}
      {/* To do: add conditional display based on radio selection */}
      <Text className="text-xl font-light my-2">If yes</Text>
      <TextInputBox name="jug-ID" placeholder='Enter a jug ID' />
      </View>,
      skippable: 1,
    },
    {
      title: 'Are you part of a Smart Hydration community?',
      content: <View>
      <RadioButton options={binaryOptions} defaultString='No'/>
      {/* Display different content depending on radio button selection: create parent component for radio button? */}
      <Text className="text-xl font-light my-2">If yes</Text>
      <TextInputBox name="invite-code" placeholder='Enter an invite code' />
      <Text className="text-xl font-light my-2">If no</Text>
      <TextInputBox name="community-name" placeholder='Enter a new community name' />
      </View>,
      skippable: 1,
    },
    {
      title: 'What is your sex?',
      content: <View>
      <RadioButton options={sexOptions} defaultString='Prefer not to say'/> {/*Bug: not defaulting to prefer not to say */}
      </View>,
      skippable: 1,
    },
    {
      title: 'What are your height and weight?',
      content: <View>
      {/* make radio buttons functional: switch between metric and imperial */}
      <Text className="text-xl font-light my-2">Height</Text>
      <RadioButton options={measureOptions} defaultString='Metric'/>
      <NumberInputBox name="height" placeholder='Enter your height in cm' />
      <Text className="text-xl font-light my-2">Weight</Text>
      <RadioButton options={measureOptions} defaultString='Metric'/>
      <NumberInputBox name="weight" placeholder='Enter your weight in kg' />
      </View>,
      skippable: 0, 
    },
  ]

  const currentPageContent = pages[pageIndex];

  const maxPageIndex = pages.length;

  const handleNext = () => {
    setPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
  };

  const handleSkip = () => {
    setPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
  };

  const handleBack = () => {
    setPageIndex((prevIndex) => (prevIndex - 1) % pages.length);
  };

  const handleSubmit = () => {
   //do nothing for now
   //later, go to homepage
  };

  const CurrentPage = pages[pageIndex];
  return (
    // app doesn't display properly unless browser is in mobile mode. Not sure if this is a problem?
      <PageWrapper>
        <View className='bg-gray-100 p-10 h-screen block'>
        <PageProgressBar currentPage={pageIndex + 1} totalPages={pages.length}></PageProgressBar>
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
      <>{pageIndex > 0 && <BackButton onPress={handleBack} />}</>
      <>{currentPageContent.skippable != 0 && <SkipButton onPress={handleSkip} />}</>
    </PageWrapper>
    //To do: Differentiate between Next and Skip buttons
       //Next should save the entered data and be greyed out when no data submitted
       //Skip should skip regardless of whether data is submitted and not save it
    //To do: Add "Skip Optional Onboarding" button on last mandatory page, with "Continue" button
    //To do: create visual progress bar to replace "Page x/y"
  )
}

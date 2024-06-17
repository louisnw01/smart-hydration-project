
import { Text } from "react-native";
import { atom, useAtom } from "jotai";
import GenericOnboardContent from "@/components/generic-onboard-content";
import NextButton from "@/components/next-button";
import SubmitButton from "@/components/submit-button";
import PageWrapper from "@/components/common/page-wrapper";


export const currentPageAtom = atom('home');
export const pageIndexAtom = atom(0);

export default function OnboardingPage( {}){
  const [pageIndex, setPageIndex] = useAtom(pageIndexAtom);
  
  //replace content with components e.g. TextInput with props for specific text like "Enter your name"
  const pages = [
    {
      title: 'What is your name?',
      content: <Text>Placeholder for name page content</Text>,
    },
    {
      title: 'What is your age?',
      content: <Text>Placeholder for age page content</Text>,
    },
    {
      title: 'What is your height?',
      content: <Text>Placeholder for height page content</Text>,
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
      <GenericOnboardContent title={currentPageContent.title}>
      {currentPageContent.content}
      </GenericOnboardContent>
      <>{pageIndex < maxPageIndex - 1 && <NextButton onPress={handleNext} />}</>
      <>{pageIndex === maxPageIndex - 1 && <SubmitButton onPress={handleSubmit} />}</>
    </PageWrapper>
  )
}

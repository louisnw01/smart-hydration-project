import { View, Text, ScrollView } from "react-native";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import GenericOnboardContent from "@/components/generic-onboard-content";
import NextButton from "@/components/next-button";
import SubmitButton from "@/components/submit-button";
import TextInputBox from "@/components/text-input-box";
import Checkbox from "@/components/checkbox";
import PageWrapper from "@/components/common/page-wrapper";
import PageProgressBar from "@/components/page-progress-bar";
import BackButton from "@/components/back-button";
import SkipButton from "@/components/skip-button";
import RegisterPage from "@/components/onboarding/register";
import NamePage from "@/components/onboarding/name";
import { registerMAtom } from "@/atom/query";
import { authTokenAtom } from "@/atom/user";

export const pageIndexAtom = atom(0);

export default function OnboardingPage() {
    const { mutate, data } = useAtomValue(registerMAtom);
    const setAuthToken = useSetAtom(authTokenAtom);

    if (data) setAuthToken(data);

    const [pageIndex, setPageIndex] = useAtom(pageIndexAtom);
    // const sexOptions = ['Female', 'Male', 'Prefer not to say'];
    {/*Bug: radio button not defaulting to prefer not to say */}
    // const binaryOptions = ['Yes', 'No'];
    // const measureOptions = ['Metric', 'Imperial'];
    // const medications = [
    //     { key: '1', value: 'Paracetemol' },
    //     { key: '2', value: 'Voltaren' },
    //     { key: '3', value: 'Asprin' },
    //     { key: '4', value: 'Ibuprofen' },
    //     { key: '5', value: 'Penicillin' },
    // ];
    // //ethnicity array isn't used yet but it will be
    // const ethicities = [
    //     { key: '1', value: 'Ethinicity 1' },
    //     { key: '2', value: 'Ethnicity 2' },
    //     { key: '3', value: 'Ethncitiy 3' },
    //     { key: '4', value: 'Etnicity 4' },
    //     { key: '5', value: 'Ethnicity 5' },
    // ];
    // const conditions = [
    //     { key: '1', value: 'Condition 1' },
    //     { key: '2', value: 'Condition 2' },
    //     { key: '3', value: 'Condition 3' },
    //     { key: '4', value: 'Condition 4' },
    //     { key: '5', value: 'Condition 5' },
    // ];

    const pages = [
        {
            title: 'Enter your email address and password',
            content: <RegisterPage />,
            skippable: 0,
        },
        {
            title: 'What is your name?',
            content: <NamePage />,
            skippable: 0,
        },
        {
            title: 'Do you consent to the collection of personal health information?',
            content:
                <View>
                    {/* To do: make this text scrollable (will be longer than a single page) */}
                    <Text className="text-xl font-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, pariatur. Excepteur sint  occaecat cupidatat non proident, sunt in culpa qui officia deserunt  mollit anim id est laborum. </Text>
                    <Checkbox text='I consent' />
                </View>,
            skippable: 0,
        },
        {
            title: 'What is your date of birth?',
            content: <View>
                <TextInputBox placeholder='dd-mm-yyyy' />
            </View>,
            skippable: 0,
        },
        // {
        //     title: 'Do you have a Smart Hydation jug?',
        //     content: <View>
        //         <RadioButton options={binaryOptions} defaultString='No' />
        //         {/* This screen TBD: are we scanning QR code? */}
        //         {/* To do: add conditional display based on radio selection */}
        //         <Text className="text-xl font-light my-2">If yes</Text>
        //         <TextInputBox name="jug-ID" placeholder='Enter a jug ID' />
        //     </View>,
        //     skippable: 1,
        // },
        // {
        //     title: 'Are you part of a Smart Hydration community?',
        //     content: <View>
        //         <RadioButton options={binaryOptions} defaultString='No' />
        //         {/* Display different content depending on radio button selection: create parent component for radio button? */}
        //         <Text className="text-xl font-light my-2">If yes</Text>
        //         <TextInputBox name="invite-code" placeholder='Enter an invite code' />
        //         <Text className="text-xl font-light my-2">If no</Text>
        //         <TextInputBox name="community-name" placeholder='Enter a new community name' />
        //     </View>,
        //     skippable: 1,
        // },
        // {
        //     title: 'What is your sex?',
        //     content: <View>
        //         <RadioButton options={sexOptions} defaultString='Prefer not to say' />
        //     </View>,
        //     skippable: 1,
        // },
        // {
        //     title: 'What are your height and weight?',
        //     content: <View>
        //         {/* make radio buttons functional: switch between metric and imperial */}
        //         <Text className="text-xl font-light my-2">Height</Text>
        //         <RadioButton options={measureOptions} defaultString='Metric' />
        //         <NumberInputBox name="height" placeholder='Enter your height in cm' />
        //         <Text className="text-xl font-light my-2">Weight</Text>
        //         <RadioButton options={measureOptions} defaultString='Metric' />
        //         <NumberInputBox name="weight" placeholder='Enter your weight in kg' />
        //     </View>,
        //     skippable: 1,
        // },
        // //make ethnicity field a single-select dropdown list
        // {
        //     title: 'What is your ethnicity?',
        //     content:
        //         <TextInputBox name="username" placeholder='Enter your ethnicity' />,
        //     skippable: 1,
        // },
        // {
        //     title: 'What medications do you take?',
        //     content: <>
        //         <SelectInputBox multiple={false} data={medications} />
        //     </>,
        //     skippable: 1,
        // }
        // ,
        // {
        //     title: 'What are your medical conditions?',
        //     content:
        //         <>
        //             <SelectInputBox multiple={false} data={conditions} />
        //         </>,
        //     skippable: 1,
        // },
        {
            title: "You're nearly there!",
            content:
                <Text className="text-xl font-light">Tap Submit All to set up your Smart Hydration profile.</Text>,
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
        mutate();
    };

    return (
        // app doesn't display properly unless browser is in mobile mode. Not sure if this is a problem?
        <PageWrapper>
            <ScrollView className="flex gap-10 mx-2">
                <PageProgressBar currentPage={pageIndex + 1} totalPages={pages.length}></PageProgressBar>
                <GenericOnboardContent title={currentPageContent.title}>
                    {currentPageContent.content}
                </GenericOnboardContent>
            </ScrollView>
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

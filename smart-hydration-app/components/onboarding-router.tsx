// import LoginRegister from "./onboarding/login-register";
// import { atom, useAtomValue } from "jotai";
// import OnboardingPage from "@/app/onboarding";
// import LoginPage from "./onboarding/login";

// // TODO move this to atoms/

// interface RegistrationInfo {
//     email: string,
//     password: string,
//     name: string,
// }

// export const onboardingRouterAtom = atom<string>('login-register');
// export const registerInfoAtom = atom<Partial<RegistrationInfo>|null>(null)

// export default function OnboardingRouter() {
//     const currentPage = useAtomValue(onboardingRouterAtom);

//     switch(currentPage) {
//     case 'login-register':
//         return <LoginRegister />
//     case 'login':
//         return <LoginPage />
//     case 'register':
//         return <OnboardingPage />
//     default:
//         return null;
//     }

// }

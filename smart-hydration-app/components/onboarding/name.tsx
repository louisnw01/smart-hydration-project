import { useSetAtom } from "jotai";
import TextInputBox from "../text-input-box";
import { registerInfoAtom } from "../onboarding-router";

export default function NamePage() {
    const setInfo = useSetAtom(registerInfoAtom);
    return (
         <TextInputBox placeholder='Enter your name' onChange={(val) => setInfo((prev) => ({...prev, name: val}))}/>
    )
}
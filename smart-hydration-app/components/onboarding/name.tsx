import { useSetAtom } from "jotai";
import TextInputBox from "../text-input-box";
import { registerInfoAtom } from "../onboarding-router";

export default function NamePage() {
    const setInfo = useSetAtom(registerInfoAtom);

    return (
        <TextInputBox
            placeholder='Enter your name'
            setValue={(val) => setInfo((prev) => ({ ...prev, name: val }))}
        />
    );
}

//trying to reconcile use of setValue function as prop in TextInputBox component with existing use of setInfo
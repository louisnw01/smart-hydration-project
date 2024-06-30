import OptionBlock from "../common/option-block";
import PopupPage from "../popup-page";

export default function SettingsModal() {
    return (
        <PopupPage height={50}>
            <OptionBlock text="Dark Mode" />
            <OptionBlock text="Notifications" />
            <OptionBlock text="Auto-Update" />
        </PopupPage>
    );
}

import { ReactElement } from "react";

type ActionComponentFunction = (
    name: string,
    isFirst?: boolean,
    isLast?: boolean,
) => ReactElement | null;

export interface ISettingsActions {
    name?: string;
    Component: ActionComponentFunction;
}

export interface ISettingsSection {
    title?: string;
    data: ISettingsActions[];
}

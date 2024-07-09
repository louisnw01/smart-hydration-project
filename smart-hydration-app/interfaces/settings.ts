import { ReactElement } from "react";

type ActionComponentFunction = (
    name: string,
    isFirst?: boolean,
    isLast?: boolean,
) => ReactElement;

export interface ISettingsActions {
    name: string;
    component: ActionComponentFunction;
}

export interface ISettingsSection {
    title: string;
    data: ISettingsActions[];
}

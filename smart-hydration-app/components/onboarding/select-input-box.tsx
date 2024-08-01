import React, { useEffect, useState } from "react";
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";

export interface SelectInputBoxProperties {
    multiple?: boolean;
    data: { key: string, value: string }[];
    onChange: (value: string) => void;
}



export const SelectInputBox: React.FC<SelectInputBoxProperties> = (props: SelectInputBoxProperties): React.ReactElement => {
    const { multiple, data, onChange } = props;

    const [selected, setSelected] = useState<string | undefined>();
    const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);


    return (
        <>
            {!multiple && <SelectList boxStyles={{ width: 284 }} data={data} setSelected={onChange} save="value" />}
            {multiple && <MultipleSelectList data={data} setSelected={(val: any) => setSelectedMultiple(val)} save="value" />}
        </>
    );
}

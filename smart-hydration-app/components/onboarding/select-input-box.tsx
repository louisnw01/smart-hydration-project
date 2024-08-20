import React, { useEffect, useState } from "react";
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";

export interface SelectInputBoxProperties {
    multiple?: boolean;
    data: { key: string, value: string }[];
    onChange?: (value: string) => void;
    onChangeMultiple?: (value: string[]) => void;
}

export const SelectInputBox: React.FC<SelectInputBoxProperties> = (props: SelectInputBoxProperties): React.ReactElement => {
    const { multiple, data, onChange, onChangeMultiple } = props;

    const [multipleOptions, setMultipleOptions] = useState<string[]>([])

    useEffect(() => {
      onChangeMultiple && onChangeMultiple(multipleOptions)
    }, [multipleOptions])

    return (
        <>
            {!multiple && onChange && <SelectList  data={data} setSelected={onChange} save="value" />}
            {multiple && onChangeMultiple && <MultipleSelectList data={data} setSelected={(v: string[]) => setMultipleOptions(v)} save="value" />}
        </>
    );
}

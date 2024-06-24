import { useEffect, useState } from "react";
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";

export interface SelectInputBoxProperties {
  multiple?: boolean;
  data: { key: string, value: string }[];
}

export const SelectInputBox = (props: SelectInputBoxProperties) => {
  const { multiple, data } = props;

  const [selected, setSelected] = useState<string | undefined>();
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);

  useEffect(() => {
    console.log(selected, selectedMultiple);
  })

  return (
    <>
      {!multiple && <SelectList data={data} setSelected={(val: any) => setSelected(val)} save="value" />}
      {multiple && <MultipleSelectList data={data} setSelected={(val: any) => setSelectedMultiple(val)} save="value" />}
    </>
  );
}

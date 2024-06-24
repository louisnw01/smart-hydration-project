import { useEffect, useState } from "react";
import { SelectList, MultipleSelectList } from "react-native-dropdown-select-list";

export interface SelectInputBoxProperties {
  multiple?: boolean;
}

export const SelectInputBox = (props: SelectInputBoxProperties) => {
  const { multiple } = props;

  const [selected, setSelected] = useState<string | undefined>();
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([]);

  useEffect(() => {
    console.log(selected, selectedMultiple);
  })

  const data = [
    { key: '1', value: 'Paracetamol' },
    { key: '2', value: 'Voltaren' },
  ];

  return (
    <>
      {!multiple && <SelectList data={data} setSelected={(val: any) => setSelected(val)} save="value" />}
      {multiple && <MultipleSelectList data={data} setSelected={(val: any) => setSelectedMultiple(val)} save="value" />}
    </>
  );
}

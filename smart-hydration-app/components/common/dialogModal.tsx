import { Modal, Text, TouchableOpacity, View } from "react-native"

export interface DialogModalProps {
  isVisible: boolean;
  text: string;
  onConfirm: () => void;
  onReject: () => void;
  confirmButtonText?: string;
  rejectButtonText?: string;
  onRequestClose?: () => void;
}

export const DialogModal: React.FC<DialogModalProps> = ({
  isVisible,
  text,
  onConfirm,
  onReject,
  onRequestClose,
  confirmButtonText = 'Yes',
  rejectButtonText = 'No',
}: DialogModalProps): React.ReactElement => {
  return (<Modal
  transparent={true}
  animationType="none"
  visible={isVisible}
  //backdropColor = {'white'}
  //backdropOpacity = {1}
  onRequestClose={() => onRequestClose && onRequestClose()}
>
  {/*<View className="flex-1 justify-center items-center bg-white bg-opacity-50">*/}
  <View className="flex-1 justify-center items-center">
      <View className="w-4/5 bg-white p-5 rounded-lg items-center">
          <Text className="text-lg mb-4">{text}</Text>
          <View className="flex-row justify-around w-full">
              <TouchableOpacity
                className="items-center bg-red rounded-xl px-7 py-3 rounded-lg"
                onPress={onConfirm}
              >
                  <Text className="text-black text-lg">{confirmButtonText}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  className="items-center bg-gray-300 py-3 px-7 rounded-lg"
                  onPress={onReject}
              >
                  <Text className="text-black text-lg">{rejectButtonText}</Text>
              </TouchableOpacity>
          </View>
      </View>
  </View>
</Modal>)
}

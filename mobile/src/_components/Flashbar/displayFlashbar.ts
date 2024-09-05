import { showMessage, type MessageType } from "react-native-flash-message";

type args = {
  type: MessageType;
  message: string;
};

export const displayFlashbar = ({ type, message }: args) => {
  showMessage({
    type,
    message,
  });
};

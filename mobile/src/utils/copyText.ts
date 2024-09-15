import { displayFlashbar } from "@/_components/Flashbar/displayFlashbar";
import Clipboard from "@react-native-clipboard/clipboard";


export const copyText = (text: string) => {
  Clipboard.setString(text);
  displayFlashbar({
    type: "success",
    message: "Copied",
  });
};

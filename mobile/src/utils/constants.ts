import { Dimensions, Platform } from "react-native";

export const bgColor = "#041C32"
export const nairaSymbol = "₦";
export const dollarSymbol = "$";
export const euroSymbol = "€";
export const poundSymbol = "£";
export const ghanaSymbol = "gh₵";
export const kenyaSymbol = "KSh";
export const australiaSymbol = "A$";
export const mexicoSymbol = "MX$";
export const dotSymbol = "\u{25cf}";
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const flagsAndSymbol = {
  NGN: {
    icon: require("@/assets/images/nigeria_flag.png"),
    symbol: nairaSymbol,
  },
  USD: {
    icon: require("@/assets/images/usa_flag.png"),
    symbol: dollarSymbol,
  },
  EUR: {
    icon: require("@/assets/images/eur_flag.png"),
    symbol: euroSymbol,
  },
  GBP: {
    icon: require("@/assets/images/uk_flag.png"),
    symbol: poundSymbol,
  },
  GHS:{
    icon: require("@/assets/images/ghana_flag.png"),
    symbol: ghanaSymbol,
  },
  KES:{
    icon: require("@/assets/images/kenya_flag.png"),
    symbol: kenyaSymbol,
  },
  AUD:{
    icon: require("@/assets/images/australia_flag.png"),
    symbol: australiaSymbol,
  },
  MXN:{
    icon: require("@/assets/images/mexico_flag.png"),
    symbol: mexicoSymbol,
  },
  BTC:{
    icon: require("@/assets/images/mexico_flag.png"),
    symbol: "BTC",
  },
  USDC:{
    icon: require("@/assets/images/mexico_flag.png"),
    symbol: dollarSymbol,
  }
};
export const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const SCREEN_HEIGHT = isIOS
  ? Dimensions.get("window").height
  : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT");
export const today = new Date();
export const eighteenYearsAgo = new Date(today.getFullYear() - 18, 0, 1);
export const getPasswordValidationRules = (value:string)=>{
  const hasCapital = /[A-Z]/.test(value);
const hasSmall = /[a-z]/.test(value);
const hasNumber = /[0-9]/.test(value);
const specialCharacters = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#'"\\]/;
const hasSpecialSymbol = specialCharacters.test(value);
const hasAtLeastEightCharacters = value.length >= 8;
const conditions = [
  {
    title: "8 characters",
    matched: hasAtLeastEightCharacters,
  },
  {
    title: "An uppercase letter",
    matched: hasCapital,
  },

  {
    title: "A number",
    matched: hasNumber,
  },
  {
    title: "A lowercase letter",
    matched: hasSmall,
  },
  {
    title: "A special character",
    matched: hasSpecialSymbol,
  },
];
const passwordIsValid =
hasAtLeastEightCharacters &&
hasSpecialSymbol &&
hasNumber &&
hasCapital &&
hasSmall;
return({
  rules: conditions,
  isPasswordValid: passwordIsValid
})
}
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

export const getTime = (date?: string) => {
  dayjs.extend(utc);
  return dayjs(date).format("hh:mm a");
};

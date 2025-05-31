import dayjs from "dayjs";

export const toTime = (unix) => dayjs.unix(unix).format("HH:mm");

export const toDate = () => dayjs().format("YYYY-MM-DD");

export const toClock = () => dayjs().format("HH:mm:ss");

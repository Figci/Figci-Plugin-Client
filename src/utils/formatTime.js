import CONFIG from "../constants/config";

const formatTime = dateString => {
  const currentDate = new Date(dateString);
  const utcMS =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000;

  const koreaTime = new Date(utcMS + CONFIG.TIME_GAP_MS);

  const year = koreaTime.getFullYear();
  const month = koreaTime.getMonth();
  const date = koreaTime.getDate();

  const hour = koreaTime.getHours();
  const AmPm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const minutes =
    koreaTime.getMinutes() < 10
      ? `0${koreaTime.getMinutes()}`
      : koreaTime.getMinutes();

  const formattedDate = `${year}-${month}-${date}`;
  const formattedTime = `${formattedHour}:${minutes} ${AmPm}`;

  return { formattedDate, formattedTime };
};

export default formatTime;

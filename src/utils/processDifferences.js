import isOwnProperty from "./isOwnProperty";
import CONFIG from "../constants/config";

const processDifferences = ({ differenceInformation }) => {
  const titleOfChanges = [];
  const detailOfChanges = [];

  if (
    differenceInformation === CONFIG.NEW_NODE ||
    differenceInformation === CONFIG.NEW_FRAME
  ) {
    return {
      titleOfChanges: ["NEW✨"],
      detailOfChanges: [differenceInformation],
      className: "active",
    };
  }

  const modifiedInformation = JSON.parse(differenceInformation);

  for (const key in modifiedInformation) {
    if (isOwnProperty(modifiedInformation, key)) {
      titleOfChanges.push(key);
      detailOfChanges.push(`Changed "${modifiedInformation[key]}"`);
    }
  }

  return { titleOfChanges, detailOfChanges, className: "active" };
};

export default processDifferences;

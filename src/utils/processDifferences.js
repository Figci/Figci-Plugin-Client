import CONFIG from "../constants/config";

const processDifferences = ({ differenceInformation }) => {
  if (
    differenceInformation === CONFIG.NEW_NODE ||
    differenceInformation === CONFIG.NEW_FRAME
  ) {
    return { text: differenceInformation, className: "active" };
  }

  const modifiedInformation = JSON.parse(differenceInformation);
  let differenceTexts = "";

  for (const key in modifiedInformation) {
    differenceTexts += `${key}(변경)\n${modifiedInformation[key]}\n`;
  }

  return { text: differenceTexts, className: "active" };
};

export default processDifferences;

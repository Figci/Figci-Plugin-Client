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
    titleOfChanges.push(`${key}`);
    detailOfChanges.push(`"${modifiedInformation[key]}"(으)로 변경됐어요!`);
  }

  return { titleOfChanges, detailOfChanges, className: "active" };
};

export default processDifferences;

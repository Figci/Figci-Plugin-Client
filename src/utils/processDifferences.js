const NEW_NODE = "이전 버전엔 없던 새로운 요소이에요!";
const NEW_FRAME = "이전 버전엔 없던 새로운 프레임이에요!";

const processDifferences = ({ differenceInformation }) => {
  if (
    differenceInformation === NEW_NODE ||
    differenceInformation === NEW_FRAME
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

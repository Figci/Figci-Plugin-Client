const createOption = versions => {
  const optionList = [];

  for (const versionId in versions) {
    const versionTitle = versions[versionId].label;

    optionList.push(
      <option value={versionId} key={versionId}>
        {versionTitle}
      </option>,
    );
  }

  return optionList;
};

export default createOption;

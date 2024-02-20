figma.showUI(__html__, { width: 400, height: 540 });

const differenceRectangleIdList = [];

figma.on("close", () => {
  differenceRectangleIdList.forEach(rectangleId => {
    const rectangleNode = figma.getNodeById(rectangleId);

    rectangleNode.remove();
  });

  differenceRectangleIdList.length = 0;
});

const isOwnProperty = (targetObject, targetProperty) => {
  return Object.prototype.hasOwnProperty.call(targetObject, targetProperty);
};

const renderDifferenceRectangle = (differences, modifiedFrames) => {
  for (const nodeId in differences) {
    if (isOwnProperty(differences, nodeId)) {
      const modifiedNode = differences[nodeId];

      const { type, differenceInformation, frameId } = modifiedNode;
      const { x, y, width, height } = modifiedNode.position;

      const differenceRectangle = figma.createRectangle();

      differenceRectangle.resize(width, height);
      differenceRectangle.x = x;
      differenceRectangle.y = y;

      switch (type) {
        case "NEW":
          differenceRectangle.fills = [
            { type: "SOLID", color: { r: 0.435, g: 0.831, b: 0.505 } },
          ];
          differenceRectangle.opacity = 0.2;
          differenceRectangle.setPluginData(
            "differenceInformation",
            "선택하신 이전 버전에는 존재하지 않는 노드 입니다!",
          );

          differenceRectangleIdList.push(differenceRectangle.id);
          modifiedFrames[frameId].isNew = false;

          break;
        case "MODIFIED":
          differenceRectangle.fills = [
            { type: "SOLID", color: { r: 0.976, g: 0.407, b: 0.329 } },
          ];
          differenceRectangle.opacity = 0.2;
          differenceRectangle.setPluginData(
            "differenceInformation",
            JSON.stringify(differenceInformation),
          );

          differenceRectangleIdList.push(differenceRectangle.id);
          modifiedFrames[frameId].isNew = false;

          break;
        default:
          break;
      }
    }
  }

  for (const frameId in modifiedFrames) {
    if (isOwnProperty(modifiedFrames, frameId)) {
      if (modifiedFrames[frameId].isNew) {
        const differenceRectangle = figma.createRectangle();
        const { x, y, width, height } = modifiedFrames[frameId];

        differenceRectangle.resize(width, height);
        differenceRectangle.x = x;
        differenceRectangle.y = y;
        differenceRectangle.fills = [
          { type: "SOLID", color: { r: 0.435, g: 0.831, b: 0.505 } },
        ];
        differenceRectangle.opacity = 0.2;
        differenceRectangle.setPluginData(
          "differenceInformation",
          "선택하신 이전 버전에는 존재하지 않는 프레임 입니다!",
        );

        differenceRectangleIdList.push(differenceRectangle.id);
      }
    }
  }
};

figma.ui.onmessage = async message => {
  if (message.type === "SAVE_ACCESS_TOKEN") {
    await figma.clientStorage.setAsync("accessToken", message.content);
  }

  if (message.type === "GET_ACCESS_TOKEN") {
    const accessToken = await figma.clientStorage.getAsync("accessToken");

    figma.ui.postMessage({
      type: "GET_ACCESS_TOKEN",
      content: accessToken,
    });
  }

  if (message.type === "GET_PROJECT_KEY") {
    const projectKey = figma.fileKey;

    figma.ui.postMessage({
      type: "GET_PROJECT_KEY",
      content: projectKey,
    });
  }

  if (message.type === "GET_CURRENT_PAGE_ID") {
    const currentPageId = figma.currentPage.id;

    figma.ui.postMessage({
      type: "GET_CURRENT_PAGE_ID",
      content: currentPageId,
    });
  }

  if (message.type === "GET_NEW_VERSION_ID") {
    const newVersionId = await figma.saveVersionHistoryAsync(
      new Date().toISOString().split("T").join(" "),
    );

    figma.ui.postMessage({
      type: "GET_NEW_VERSION_ID",
      content: newVersionId,
    });
  }

  if (message.type === "POST_DIFFING_RESULT") {
    const { differences, modifiedFrames } = message.content;

    differenceRectangleIdList.length = 0;

    renderDifferenceRectangle(differences, modifiedFrames);
  }
};

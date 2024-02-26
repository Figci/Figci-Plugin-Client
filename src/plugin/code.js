figma.showUI(__html__, { width: 400, height: 540 });

const differenceRectangleIdList = [];

const CONSTANTS = {
  MODIFIED_FILLS: {
    type: "SOLID",
    color: { r: 1, g: 0.419, b: 0 },
    opacity: 0.000001,
  },
  MODIFIED_STROKES: {
    type: "SOLID",
    color: { r: 1, g: 0.419, b: 0 },
    opacity: 0.6,
  },
  NEW_FILLS: {
    type: "SOLID",
    color: { r: 0.129, g: 0.8, b: 0.239 },
    opacity: 0.000001,
  },
  NEW_STROKES: {
    type: "SOLID",
    color: { r: 0.129, g: 0.8, b: 0.239 },
    opacity: 1,
  },
  MIN_SIZE_VALUE: 1,
  TIME_GAP_MS: 9 * 60 * 60 * 1000,
  PAGINATION: {
    INDEX_INCREASE: 1,
    INDEX_DECREASE: -1,
  },
};

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

      differenceRectangle.name = "Difference Rectangle Node";
      differenceRectangle.resize(
        width + 6 || CONSTANTS.MIN_SIZE_VALUE,
        height + 6 || CONSTANTS.MIN_SIZE_VALUE,
      );
      differenceRectangle.x = x - 3;
      differenceRectangle.y = y - 3;

      switch (type) {
        case "NEW":
          differenceRectangle.fills = [CONSTANTS.NEW_FILLS];
          differenceRectangle.strokes = [CONSTANTS.NEW_STROKES];
          differenceRectangle.strokeWeight = 3;
          differenceRectangle.strokeAlign = "OUTSIDE";
          differenceRectangle.setPluginData(
            "differenceInformation",
            "이전 버전엔 없던 새로운 요소에요!",
          );

          break;
        case "MODIFIED":
          differenceRectangle.fills = [CONSTANTS.MODIFIED_FILLS];
          differenceRectangle.strokes = [CONSTANTS.MODIFIED_STROKES];
          differenceRectangle.strokeWeight = 3;
          differenceRectangle.strokeAlign = "OUTSIDE";
          differenceRectangle.setPluginData(
            "differenceInformation",
            JSON.stringify(differenceInformation),
          );

          break;
        default:
          break;
      }

      differenceRectangleIdList.push(differenceRectangle.id);

      modifiedFrames[frameId].isNew = false;
    }
  }

  for (const frameId in modifiedFrames) {
    if (isOwnProperty(modifiedFrames, frameId)) {
      if (modifiedFrames[frameId].isNew) {
        const differenceRectangle = figma.createRectangle();
        const { x, y, width, height } = modifiedFrames[frameId];

        differenceRectangle.name = "Difference Rectangle Node";
        differenceRectangle.resize(width + 6, height + 6);
        differenceRectangle.x = x - 3;
        differenceRectangle.y = y - 3;
        differenceRectangle.fills = [CONSTANTS.NEW_FILLS];
        differenceRectangle.strokes = [CONSTANTS.NEW_STROKES];
        differenceRectangle.strokeWeight = 3;
        differenceRectangle.strokeAlign = "OUTSIDE";
        differenceRectangle.setPluginData(
          "differenceInformation",
          "이전 버전엔 없던 새로운 프레임이에요!",
        );

        differenceRectangleIdList.push(differenceRectangle.id);
      }
    }
  }

  differenceRectangleIdList.reverse();
};

const clearRectangleNode = () => {
  differenceRectangleIdList.forEach(rectangleNodeId => {
    const rectangleNode = figma.getNodeById(rectangleNodeId);

    rectangleNode.remove();
  });

  differenceRectangleIdList.length = 0;
};

const formatTime = dateString => {
  const currentDate = new Date(dateString);
  const utcMS =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60 * 1000;

  const koreaTime = new Date(utcMS + CONSTANTS.TIME_GAP_MS);

  const year = koreaTime.getFullYear();
  const month = koreaTime.getMonth() + 1;
  const date = koreaTime.getDate();

  const hour = koreaTime.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12;
  const minutes =
    koreaTime.getMinutes() < 10
      ? `0${koreaTime.getMinutes()}`
      : koreaTime.getMinutes();

  const formattedDate = `${year}-${month}-${date}`;
  const formattedTime = `${formattedHour}:${minutes} ${ampm}`;

  return { formattedDate, formattedTime };
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

  if (message.type === "GET_CURRENT_PAGE_ID") {
    const currentPageId = figma.currentPage.id;

    figma.ui.postMessage({
      type: "GET_CURRENT_PAGE_ID",
      content: currentPageId,
    });
  }

  if (message.type === "GET_NEW_VERSION_ID") {
    const currentDateString = new Date().toISOString();
    const { formattedTime: createdTime } = formatTime(currentDateString);

    const newVersionId = await figma.saveVersionHistoryAsync(createdTime);

    figma.ui.postMessage({
      type: "GET_NEW_VERSION_ID",
      content: newVersionId,
    });
  }

  if (message.type === "POST_DIFFING_RESULT") {
    const { differences, modifiedFrames } = message.content;

    clearRectangleNode();

    renderDifferenceRectangle(differences, modifiedFrames);

    const startNodeId = differenceRectangleIdList[0];
    const startNode = figma.getNodeById(startNodeId);

    figma.viewport.scrollAndZoomIntoView([startNode]);
    figma.currentPage.selection = [startNode];
  }

  if (message.type === "PAGINATION_BUTTON") {
    const currentSelection = figma.currentPage.selection[0];
    const differencesNumber = differenceRectangleIdList.length;

    if (
      currentSelection &&
      differenceRectangleIdList.includes(currentSelection.id)
    ) {
      const currentNodeId = figma.currentPage.selection[0].id;
      const currentIndex = differenceRectangleIdList.indexOf(currentNodeId);

      let nextIndex;
      if (message.content === "prev") {
        nextIndex =
          (currentIndex +
            CONSTANTS.PAGINATION.INDEX_DECREASE +
            differencesNumber) %
          differencesNumber;
      } else {
        nextIndex =
          (currentIndex + CONSTANTS.PAGINATION.INDEX_INCREASE) %
          differencesNumber;
      }

      const nextNodeId = differenceRectangleIdList[nextIndex];
      const nextNode = figma.getNodeById(nextNodeId);

      figma.viewport.scrollAndZoomIntoView([nextNode]);
      figma.currentPage.selection = [nextNode];
    } else {
      const startNodeId = differenceRectangleIdList[0];
      const startNode = figma.getNodeById(startNodeId);

      figma.viewport.scrollAndZoomIntoView([startNode]);
      figma.currentPage.selection = [startNode];
    }
  }
};

figma.on("selectionchange", () => {
  const currentSelection = figma.currentPage.selection[0];

  if (!currentSelection) {
    return;
  }

  const differencesNumber = differenceRectangleIdList.length;

  if (differenceRectangleIdList.includes(currentSelection.id)) {
    const differenceInformation = currentSelection.getPluginData(
      "differenceInformation",
    );

    const currentFrameIndex =
      differenceRectangleIdList.indexOf(currentSelection.id) + 1;

    figma.ui.postMessage({
      type: "FRAME_PAGINATION",
      content: {
        result: true,
        currentCount: currentFrameIndex,
        frameCounts: differencesNumber,
      },
    });

    figma.ui.postMessage({
      type: "RENDER_DIFFERENCE_INFORMATION",
      content: { differenceInformation },
    });

    return;
  }

  figma.ui.postMessage({
    type: "RENDER_DIFFERENCE_INFORMATION",
    content: "UNCHANGED_NODE",
  });

  if (differencesNumber) {
    figma.ui.postMessage({
      type: "FRAME_PAGINATION",
      content: {
        result: true,
        currentCount: 0,
        frameCounts: differencesNumber,
      },
    });

    return;
  }

  figma.ui.postMessage({
    type: "FRAME_PAGINATION",
    content: {
      result: false,
      frameCounts: "- / -",
    },
  });
});

figma.on("currentpagechange", () => {
  const currentPageId = figma.currentPage.id;

  clearRectangleNode();

  figma.ui.postMessage({
    type: "CHANGED_CURRENT_PAGE_ID",
    content: currentPageId,
  });
});

figma.on("close", () => {
  clearRectangleNode();

  figma.closePlugin();
});

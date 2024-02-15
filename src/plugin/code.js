figma.showUI(__html__, { height: 500, width: 500 });

figma.ui.onmessage = message => {
  figma.closePlugin();
};

const postMessage = (type, content = null, origin = "*") => {
  window.parent.postMessage(
    {
      pluginMessage: {
        type,
        content,
      },
    },
    origin,
  );
};

export default postMessage;

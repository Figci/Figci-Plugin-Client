const isOwnProperty = (targetObject, targetProperty) => {
  return Object.prototype.hasOwnProperty.call(targetObject, targetProperty);
};

export default isOwnProperty;

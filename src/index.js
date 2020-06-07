// @flow
/* eslint-disable no-param-reassign, no-use-before-define */
import T from "prop-types";
import "./ensureDevPropTypes";

const mutatePropType = (name: string, object: Object = T[name]): void => {
  object.type = { ...object.type, name };
  if (object.isRequired) {
    object.isRequired.required = true;
    Object.keys(object)
      .filter(key => !["isRequired"].includes(key))
      .forEach(key => {
        object.isRequired[key] = object[key];
      });
    mutatePropType(name, object.isRequired);
  }
};

const mutatePropTypeFn = (name: string): void => {
  const original = T[name];
  T[name] = arg => {
    const object = original(arg);
    if (typeof arg === "function" && arg.name.indexOf("checkType") >= 0) {
      // arrayOf
      object.type = { value: parsePropTypeMethod(arg).type };
    } else if (typeof arg === "function") {
      // instanceOf
      object.type = { value: arg.name };
    } else if (Array.isArray(arg) && typeof arg[0] === "function") {
      // oneOfType
      object.type = {
        value: arg.map(method => parsePropTypeMethod(method).type)
      };
    } else if (!Array.isArray(arg) && typeof arg === "object") {
      // shape
      object.type = { value: parsePropTypes({ propTypes: arg }) };
    } else {
      // oneOf
      object.type = { value: arg };
    }
    mutatePropType(name, object);
    return object;
  };
};

Object.keys(T)
  .filter(type => !["exact", "checkPropTypes", "PropTypes"].includes(type))
  .forEach(type => {
    if (T[type].isRequired) {
      return mutatePropType(type);
    }
    return mutatePropTypeFn(type);
  });

const parsePropTypeMethod = (
  { isRequired, ...method }: Object = {},
  value?: any
): Object => ({
  type: {
    name: "custom"
  },
  required: false,
  ...(typeof value !== "undefined" ? { defaultValue: { value } } : {}),
  ...method
});

/** */
const parsePropTypes = ({
  propTypes = {},
  defaultProps = {}
}: {
  propTypes?: Object,
  defaultProps?: Object
}): Object =>
  Object.keys(propTypes).reduce(
    (parsed, prop) => ({
      ...parsed,
      [prop]: parsePropTypeMethod(propTypes[prop], defaultProps[prop])
    }),
    {}
  );

export default parsePropTypes;

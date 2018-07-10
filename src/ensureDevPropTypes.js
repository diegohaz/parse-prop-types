import T from "prop-types";

const REACT_ELEMENT_TYPE =
  (typeof Symbol === "function" && Symbol.for && Symbol.for("react.element")) ||
  0xeac7;

const isValidElement = object =>
  typeof object === "object" &&
  object !== null &&
  object.$$typeof === REACT_ELEMENT_TYPE;

const devPropTypes = require("prop-types/factoryWithTypeCheckers")(
  isValidElement,
  true
);

Object.keys(T).forEach(key => {
  T[key] = devPropTypes[key];
});

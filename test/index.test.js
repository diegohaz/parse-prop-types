import PropTypes from "prop-types";
import parsePropTypes from "../src";

const propTypes = {
  foo: PropTypes.string.isRequired,
  bar: PropTypes.bool,
  baz: PropTypes.arrayOf(PropTypes.string).isRequired,
  qux: PropTypes.oneOf(["foo", "bar", "baz"]),
  quux: PropTypes.shape({
    foo: PropTypes.string,
    bar: PropTypes.instanceOf(String).isRequired
  }),
  foo2: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      foo: PropTypes.string
    })
  ])
};

describe("parsePropTypes", () => {
  it("works", () => {
    const Component = {
      propTypes,
      defaultProps: {
        bar: false
      }
    };
    expect(parsePropTypes(Component)).toMatchSnapshot();
  });

  it("works without defaultProps", () => {
    const Component = { propTypes };
    expect(parsePropTypes(Component)).toMatchSnapshot();
  });

  it("works without propTypes", () => {
    const Component = {};
    expect(parsePropTypes(Component)).toEqual({});
  });

  it("works with propDescriptions", () => {
    const Component = {
      propTypes: {
        foo: PropTypes.string.isRequired,
        bar: PropTypes.bool
      },
      propDescriptions: {
        foo: "Important string",
        bar: "True or false"
      }
    };

    expect(parsePropTypes(Component)).toMatchSnapshot();
  });
});

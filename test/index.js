import PropTypes from 'prop-types'
import parsePropTypes from '../src'

describe('parsePropTypes', () => {
  it('works', () => {
    const Component = {
      propTypes: {
        foo: PropTypes.string.isRequired,
        bar: PropTypes.bool,
        baz: PropTypes.arrayOf(PropTypes.string).isRequired,
      },
      defaultProps: {
        bar: false,
      },
    }
    expect(parsePropTypes(Component)).toEqual({
      foo: {
        type: 'string',
        required: true,
        default: undefined,
      },
      bar: {
        type: 'bool',
        required: false,
        default: false,
      },
      baz: {
        type: 'other',
        required: true,
        default: undefined,
      },
    })
  })

  it('works without defaultProps', () => {
    const Component = {
      propTypes: {
        foo: PropTypes.string.isRequired,
        baz: PropTypes.arrayOf(PropTypes.string).isRequired,
      },
    }
    expect(parsePropTypes(Component)).toEqual({
      foo: {
        type: 'string',
        required: true,
        default: undefined,
      },
      baz: {
        type: 'other',
        required: true,
        default: undefined,
      },
    })
  })

  it('works without propTypes', () => {
    const Component = {}
    expect(parsePropTypes(Component)).toEqual({})
  })
})

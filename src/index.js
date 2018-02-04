// @flow
import T from 'prop-types'

type PropTypes = {
  [key: string]: Function,
}

type Component = {
  propTypes?: PropTypes,
  defaultProps?: {
    [key: string]: any,
  },
}

type ParsedPropType = {
  type: string,
  required: boolean,
  default: any,
}

type ParsedPropTypes = {
  [key: string]: ParsedPropType,
}

const isCorrectPropType = (method: Function, propType: string): boolean =>
  method === T[propType] || method === T[propType].isRequired

const createPropTypeObject = (method: Function, defaultValue?: any): ParsedPropType => {
  const primitives = [
    'array',
    'bool',
    'func',
    'object',
    'string',
    'symbol',
    'any',
    'element',
    'node',
  ]

  const defaultObject = {
    type: 'other',
    required: !method.isRequired,
    default: defaultValue,
  }

  return primitives.reduce(
    (obj, propType) => (isCorrectPropType(method, propType) ? { ...obj, type: propType } : obj),
    defaultObject
  )
}

/** */
const parsePropTypes = ({ propTypes = {}, defaultProps = {} }: Component): ParsedPropTypes =>
  Object.keys(propTypes).reduce((parsed, prop) => {
    const method = propTypes[prop]
    const defaultValue = defaultProps[prop]

    return {
      ...parsed,
      [prop]: createPropTypeObject(method, defaultValue),
    }
  }, {})

export default parsePropTypes

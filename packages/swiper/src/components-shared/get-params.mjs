import defaults from '../core/defaults.mjs'
import { extend, isObject } from './utils.mjs'
import { paramsList } from './params-list.mjs'

function getParams(obj = {}, splitEvents = true) {
  const params = {
    on: {},
  }
  const events = {}
  const passedParams = {}

  extend(params, defaults)
  params._emitClasses = true
  params.init = false

  const rest = {}
  const allowedParams = new Set(paramsList.map(key => key.replace(/_/, '')))
  const plainObj = { ...obj }

  for (const key of Object.keys(plainObj)) {
    if (obj[key] === undefined)
      continue

    if (allowedParams.has(key)) {
      if (isObject(obj[key])) {
        params[key] = {}
        passedParams[key] = {}
        extend(params[key], obj[key])
        extend(passedParams[key], obj[key])
      }
      else {
        params[key] = obj[key]
        passedParams[key] = obj[key]
      }
    }
    else if (key.search(/on[A-Z]/) === 0 && typeof obj[key] === 'function') {
      if (splitEvents)
        events[`${key[2].toLowerCase()}${key.slice(3)}`] = obj[key]
      else
        params.on[`${key[2].toLowerCase()}${key.slice(3)}`] = obj[key]
    }
    else {
      rest[key] = obj[key]
    }
  }

  for (const key of ['navigation', 'pagination', 'scrollbar']) {
    if (params[key] === true)
      params[key] = {}

    if (params[key] === false)
      delete params[key]
  }

  return { params, passedParams, rest, events }
}

export { getParams }

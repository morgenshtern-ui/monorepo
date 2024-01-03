import { isObject } from '@teleskop-labs/utils'

export function extend(target: any = {}, src: any = {}) {
  const keys = Object.keys(src)

  for (const key of keys) {
    if (target[key] === undefined)
      target[key] = src[key]
    else if (
      isObject(src[key])
      && isObject(target[key])
      && Object.keys(src[key]).length > 0
    )
      extend(target[key], src[key])
  }
}

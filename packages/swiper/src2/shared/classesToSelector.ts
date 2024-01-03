/* eslint-disable unicorn/better-regex */
export function classesToSelector(classes = '') {
  const selector = classes
    .trim()
    .replaceAll(/([\.:!+\/])/g, '\\$1')
    .replaceAll(' ', '.')

  return `.${selector}`
}

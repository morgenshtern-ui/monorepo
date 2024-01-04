/* eslint-disable unicorn/better-regex */
export default function classesToSelector(classes = '') {
  return `.${classes
    .trim()
    .replaceAll(/([\.:!+\/])/g, '\\$1')
    .replaceAll(' ', '.')}`
}

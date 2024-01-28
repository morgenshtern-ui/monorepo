// separate `:not()` selectors has broader browser support than the newer
//  `:not([inert], [inert] *)` (Feb 2023)

// NOTE: отдельные селекторы `:not()` имеют более широкую поддержку браузеров, чем более новые
// `:not([inert], [inert] *)` (февраль 2023 г.)
// CAREFUL: JSDom не поддерживает `:not([inert] *)` в качестве селектора; его использование
// приводит к сбою всего запроса, в результате чего узлы не будут найдены,
// что сломает многое... поэтому мы должны полагаться на JS для идентификации
// узлов внутри инертного контейнера.

const candidateSelectors = [
  'input:not([inert])',
  'select:not([inert])',
  'textarea:not([inert])',
  'a[href]:not([inert])',
  'button:not([inert])',
  '[tabindex]:not(slot):not([inert])',
  'audio[controls]:not([inert])',
  'video[controls]:not([inert])',
  '[contenteditable]:not([contenteditable="false"]):not([inert])',
  'details>summary:first-of-type:not([inert])',
  'details:not([inert])',
]

export const candidateSelector = /* #__PURE__ */ candidateSelectors.join(',')

export const focusableCandidateSelector = /* #__PURE__ */ [...candidateSelectors, 'iframe'].join(',')

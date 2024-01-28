// Number.isNaN as it is not supported in IE11 so conditionally using ponyfill
// Using Number.isNaN where possible as it is ~10% faster

const isNan = Number.isNaN

function isEqual(first: unknown, second: unknown): boolean {
  if (first === second)
    return true

  // Special case for NaN (NaN !== NaN)
  if (isNan(first) && isNan(second))
    return true

  return false
}

export function areInputsEqual(
  newInputs: readonly unknown[],
  lastInputs: readonly unknown[],
): boolean {
  // никаких проверок не требуется, если длина входных данных изменилась
  if (newInputs.length !== lastInputs.length)
    return false

  for (const [i, newInput] of newInputs.entries()) {
    if (!isEqual(newInput, lastInputs[i]))
      return false
  }

  return true
}

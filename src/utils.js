/**
 * Small shared helpers used by the exercise bank and UI components.
 */

/**
 * Fisher-Yates shuffle. Returns a new array; does not mutate the input.
 * @template T
 * @param {T[]} items
 * @returns {T[]}
 */
export function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Formats a JS value the way it would be written as Python source, based on
 * its declared Python type (so students see "True", quoted strings, etc).
 * @param {*} value
 * @param {'int'|'float'|'str'|'bool'} type
 * @returns {string}
 */
export function formatPyValue(value, type) {
  if (type === 'str') return `"${value}"`;
  if (type === 'bool') return value ? 'True' : 'False';
  if (type === 'float') return Number.isInteger(value) ? `${value}.0` : String(value);
  return String(value);
}

/**
 * Builds a shuffled permutation of [0 .. length - 1], retrying once if it
 * happens to land on the identity order (so the keyword-argument stage
 * visibly reorders the parameters whenever there's more than one).
 * @param {number} length
 * @returns {number[]}
 */
export function shuffledOrder(length) {
  const identity = Array.from({ length }, (_, i) => i);
  if (length < 2) return identity;
  let attempt = shuffle(identity);
  let tries = 0;
  while (attempt.every((v, i) => v === i) && tries < 5) {
    attempt = shuffle(identity);
    tries += 1;
  }
  return attempt;
}

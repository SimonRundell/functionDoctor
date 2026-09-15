import { shuffle } from '../utils.js';

/**
 * @typedef {'int'|'float'|'str'|'bool'} PyType
 */

/**
 * @typedef {Object} Variable
 * @property {string} name
 * @property {*} value
 * @property {PyType} type
 */

/**
 * @typedef {Object} Exercise
 * @property {string} id
 * @property {string} funcName
 * @property {{name: string, type: PyType}[]} params - parameters in definition order
 * @property {string} bodyPython - the function definition as Python source, for display only
 * @property {(args: any[]) => any} run - computes the return value from ordered argument values
 * @property {PyType} resultType - the type of the returned value, for display formatting
 * @property {Variable[]} variables - the correct argument for each parameter, same order as params
 */

/**
 * Extra "flavour" variables used purely as distractors. Each exercise only
 * pulls distractors whose type doesn't match any of its own parameters, so
 * type-matching a chip to a slot is always sufficient to prove it's correct.
 * @type {Variable[]}
 */
const DISTRACTOR_POOL = [
  { name: 'pet_name', value: 'Biscuit', type: 'str' },
  { name: 'team_size', value: 11, type: 'int' },
  { name: 'temperature', value: 21.5, type: 'float' },
  { name: 'is_raining', value: false, type: 'bool' },
  { name: 'nickname', value: 'Sparky', type: 'str' },
  { name: 'lucky_number', value: 13, type: 'int' },
  { name: 'gpa', value: 3.8, type: 'float' },
  { name: 'is_weekend', value: true, type: 'bool' },
];

/** @type {Record<number, Exercise[]>} */
const EXERCISES = {
  1: [
    {
      id: 'square_number',
      funcName: 'square_number',
      params: [{ name: 'n', type: 'int' }],
      bodyPython: 'def square_number(n):\n    return n * n',
      run: ([n]) => n * n,
      resultType: 'int',
      variables: [{ name: 'side_length', value: 6, type: 'int' }],
    },
    {
      id: 'shout',
      funcName: 'shout',
      params: [{ name: 'word', type: 'str' }],
      bodyPython: 'def shout(word):\n    return word.upper() + "!"',
      run: ([word]) => `${String(word).toUpperCase()}!`,
      resultType: 'str',
      variables: [{ name: 'greeting', value: 'hello', type: 'str' }],
    },
    {
      id: 'half',
      funcName: 'half',
      params: [{ name: 'amount', type: 'float' }],
      bodyPython: 'def half(amount):\n    return amount / 2',
      run: ([amount]) => amount / 2,
      resultType: 'float',
      variables: [{ name: 'pocket_money', value: 9.5, type: 'float' }],
    },
    {
      id: 'flip_switch',
      funcName: 'flip_switch',
      params: [{ name: 'is_on', type: 'bool' }],
      bodyPython: 'def flip_switch(is_on):\n    return not is_on',
      run: ([isOn]) => !isOn,
      resultType: 'bool',
      variables: [{ name: 'light_on', value: true, type: 'bool' }],
    },
    {
      id: 'triple',
      funcName: 'triple',
      params: [{ name: 'value', type: 'int' }],
      bodyPython: 'def triple(value):\n    return value * 3',
      run: ([value]) => value * 3,
      resultType: 'int',
      variables: [{ name: 'points', value: 7, type: 'int' }],
    },
  ],
  2: [
    {
      id: 'repeat_word',
      funcName: 'repeat_word',
      params: [{ name: 'word', type: 'str' }, { name: 'times', type: 'int' }],
      bodyPython: 'def repeat_word(word, times):\n    return word * times',
      run: ([word, times]) => String(word).repeat(times),
      resultType: 'str',
      variables: [
        { name: 'chant', value: 'Ole ', type: 'str' },
        { name: 'count', value: 3, type: 'int' },
      ],
    },
    {
      id: 'order_cost',
      funcName: 'order_cost',
      params: [{ name: 'price', type: 'float' }, { name: 'quantity', type: 'int' }],
      bodyPython: 'def order_cost(price, quantity):\n    return price * quantity',
      run: ([price, quantity]) => Math.round(price * quantity * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'unit_price', value: 2.5, type: 'float' },
        { name: 'basket_size', value: 4, type: 'int' },
      ],
    },
    {
      id: 'can_vote',
      funcName: 'can_vote',
      params: [{ name: 'age', type: 'int' }, { name: 'is_registered', type: 'bool' }],
      bodyPython: 'def can_vote(age, is_registered):\n    return age >= 18 and is_registered',
      run: ([age, isRegistered]) => age >= 18 && isRegistered,
      resultType: 'bool',
      variables: [
        { name: 'years_old', value: 19, type: 'int' },
        { name: 'on_roll', value: true, type: 'bool' },
      ],
    },
    {
      id: 'summarise_temp',
      funcName: 'summarise_temp',
      params: [{ name: 'city', type: 'str' }, { name: 'degrees', type: 'float' }],
      bodyPython: 'def summarise_temp(city, degrees):\n    return f"{city} is {degrees} degrees C"',
      run: ([city, degrees]) => `${city} is ${degrees} degrees C`,
      resultType: 'str',
      variables: [
        { name: 'town', value: 'Exeter', type: 'str' },
        { name: 'reading', value: 16.5, type: 'float' },
      ],
    },
    {
      id: 'describe_member',
      funcName: 'describe_member',
      params: [{ name: 'name', type: 'str' }, { name: 'is_vip', type: 'bool' }],
      bodyPython: 'def describe_member(name, is_vip):\n    return f"{name} (VIP)" if is_vip else name',
      run: ([name, isVip]) => (isVip ? `${name} (VIP)` : name),
      resultType: 'str',
      variables: [
        { name: 'customer', value: 'Priya', type: 'str' },
        { name: 'gold_card', value: false, type: 'bool' },
      ],
    },
  ],
  3: [
    {
      id: 'order_total',
      funcName: 'order_total',
      params: [{ name: 'item', type: 'str' }, { name: 'qty', type: 'int' }, { name: 'price', type: 'float' }],
      bodyPython: 'def order_total(item, qty, price):\n    return f"{qty} x {item} = £{qty * price:.2f}"',
      run: ([item, qty, price]) => `${qty} x ${item} = £${(qty * price).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'product', value: 'Pens', type: 'str' },
        { name: 'amount', value: 5, type: 'int' },
        { name: 'unit_cost', value: 0.75, type: 'float' },
      ],
    },
    {
      id: 'student_report',
      funcName: 'student_report',
      params: [{ name: 'name', type: 'str' }, { name: 'age', type: 'int' }, { name: 'has_passed', type: 'bool' }],
      bodyPython: 'def student_report(name, age, has_passed):\n    result = "Pass" if has_passed else "Fail"\n    return f"{name} ({age}) - {result}"',
      run: ([name, age, hasPassed]) => `${name} (${age}) - ${hasPassed ? 'Pass' : 'Fail'}`,
      resultType: 'str',
      variables: [
        { name: 'pupil', value: 'Alex', type: 'str' },
        { name: 'years', value: 17, type: 'int' },
        { name: 'passed_unit', value: true, type: 'bool' },
      ],
    },
    {
      id: 'journey_price',
      funcName: 'journey_price',
      params: [{ name: 'miles', type: 'int' }, { name: 'rate', type: 'float' }, { name: 'is_member', type: 'bool' }],
      bodyPython: 'def journey_price(miles, rate, is_member):\n    discount = 0.9 if is_member else 1\n    return round(miles * rate * discount, 2)',
      run: ([miles, rate, isMember]) => Math.round(miles * rate * (isMember ? 0.9 : 1) * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'distance', value: 40, type: 'int' },
        { name: 'price_per_mile', value: 0.45, type: 'float' },
        { name: 'has_pass', value: true, type: 'bool' },
      ],
    },
    {
      id: 'label_price',
      funcName: 'label_price',
      params: [{ name: 'item', type: 'str' }, { name: 'price', type: 'float' }, { name: 'on_sale', type: 'bool' }],
      bodyPython: 'def label_price(item, price, on_sale):\n    final_price = price * 0.8 if on_sale else price\n    return f"{item}: £{final_price:.2f}"',
      run: ([item, price, onSale]) => `${item}: £${(onSale ? price * 0.8 : price).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'product2', value: 'Mug', type: 'str' },
        { name: 'cost', value: 6.0, type: 'float' },
        { name: 'discounted', value: false, type: 'bool' },
      ],
    },
    {
      id: 'scale_recipe',
      funcName: 'scale_recipe',
      params: [{ name: 'dish', type: 'str' }, { name: 'servings', type: 'int' }, { name: 'grams_per_serving', type: 'float' }],
      bodyPython: 'def scale_recipe(dish, servings, grams_per_serving):\n    total = servings * grams_per_serving\n    return f"{dish}: {total:.0f}g total"',
      run: ([dish, servings, grams]) => `${dish}: ${Math.round(servings * grams)}g total`,
      resultType: 'str',
      variables: [
        { name: 'meal', value: 'Pasta', type: 'str' },
        { name: 'people', value: 4, type: 'int' },
        { name: 'grams_each', value: 85.5, type: 'float' },
      ],
    },
  ],
};

/**
 * Picks a random exercise for the given arity, avoiding an immediate repeat
 * of `excludeId` when there's more than one option available.
 * @param {number} arity
 * @param {string|null} [excludeId]
 * @returns {Exercise}
 */
export function pickExercise(arity, excludeId = null) {
  const bank = EXERCISES[arity];
  const options = bank.length > 1 ? bank.filter((ex) => ex.id !== excludeId) : bank;
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Builds the shuffled pool of chips for an exercise: one correct variable
 * per parameter, plus two distractors whose type doesn't match any
 * parameter (so they can never be validly dropped anywhere).
 * @param {Exercise} exercise
 * @returns {Array<Variable & { key: string, isCorrect: boolean }>}
 */
export function buildChipPool(exercise) {
  const usedTypes = new Set(exercise.params.map((p) => p.type));
  const distractorOptions = DISTRACTOR_POOL.filter((v) => !usedTypes.has(v.type));
  const distractors = shuffle(distractorOptions).slice(0, 2);
  const correct = exercise.variables.map((v, i) => ({ ...v, key: `${exercise.id}-correct-${i}`, isCorrect: true }));
  const extras = distractors.map((v, i) => ({ ...v, key: `${exercise.id}-distractor-${i}`, isCorrect: false }));
  return shuffle([...correct, ...extras]);
}

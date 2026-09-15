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
    {
      id: 'double_number',
      funcName: 'double_number',
      params: [{ name: 'n', type: 'int' }],
      bodyPython: 'def double_number(n):\n    return n * 2',
      run: ([n]) => n * 2,
      resultType: 'int',
      variables: [{ name: 'quantity', value: 8, type: 'int' }],
    },
    {
      id: 'cube_number',
      funcName: 'cube_number',
      params: [{ name: 'n', type: 'int' }],
      bodyPython: 'def cube_number(n):\n    return n ** 3',
      run: ([n]) => n ** 3,
      resultType: 'int',
      variables: [{ name: 'edge', value: 3, type: 'int' }],
    },
    {
      id: 'is_even',
      funcName: 'is_even',
      params: [{ name: 'n', type: 'int' }],
      bodyPython: 'def is_even(n):\n    return n % 2 == 0',
      run: ([n]) => n % 2 === 0,
      resultType: 'bool',
      variables: [{ name: 'ticket_number', value: 24, type: 'int' }],
    },
    {
      id: 'count_down',
      funcName: 'count_down',
      params: [{ name: 'n', type: 'int' }],
      bodyPython: 'def count_down(n):\n    return n - 1',
      run: ([n]) => n - 1,
      resultType: 'int',
      variables: [{ name: 'lives_left', value: 5, type: 'int' }],
    },
    {
      id: 'add_ten',
      funcName: 'add_ten',
      params: [{ name: 'n', type: 'int' }],
      bodyPython: 'def add_ten(n):\n    return n + 10',
      run: ([n]) => n + 10,
      resultType: 'int',
      variables: [{ name: 'score', value: 42, type: 'int' }],
    },
    {
      id: 'reverse_word',
      funcName: 'reverse_word',
      params: [{ name: 'word', type: 'str' }],
      bodyPython: 'def reverse_word(word):\n    return word[::-1]',
      run: ([word]) => String(word).split('').reverse().join(''),
      resultType: 'str',
      variables: [{ name: 'username', value: 'exeter', type: 'str' }],
    },
    {
      id: 'first_letter',
      funcName: 'first_letter',
      params: [{ name: 'name', type: 'str' }],
      bodyPython: 'def first_letter(name):\n    return name[0]',
      run: ([name]) => String(name)[0],
      resultType: 'str',
      variables: [{ name: 'student_name', value: 'Maya', type: 'str' }],
    },
    {
      id: 'whisper',
      funcName: 'whisper',
      params: [{ name: 'word', type: 'str' }],
      bodyPython: 'def whisper(word):\n    return word.lower() + "..."',
      run: ([word]) => `${String(word).toLowerCase()}...`,
      resultType: 'str',
      variables: [{ name: 'announcement', value: 'QUIET', type: 'str' }],
    },
    {
      id: 'count_letters',
      funcName: 'count_letters',
      params: [{ name: 'word', type: 'str' }],
      bodyPython: 'def count_letters(word):\n    return len(word)',
      run: ([word]) => String(word).length,
      resultType: 'int',
      variables: [{ name: 'password', value: 'python3', type: 'str' }],
    },
    {
      id: 'add_prefix',
      funcName: 'add_prefix',
      params: [{ name: 'code', type: 'str' }],
      bodyPython: 'def add_prefix(code):\n    return "EC-" + code',
      run: ([code]) => `EC-${code}`,
      resultType: 'str',
      variables: [{ name: 'module_code', value: 'CS101', type: 'str' }],
    },
    {
      id: 'round_up',
      funcName: 'round_up',
      params: [{ name: 'n', type: 'float' }],
      bodyPython: 'def round_up(n):\n    return round(n)',
      run: ([n]) => Math.round(n),
      resultType: 'int',
      variables: [{ name: 'temperature_reading', value: 18.6, type: 'float' }],
    },
    {
      id: 'double_float',
      funcName: 'double_float',
      params: [{ name: 'amount', type: 'float' }],
      bodyPython: 'def double_float(amount):\n    return amount * 2',
      run: ([amount]) => amount * 2,
      resultType: 'float',
      variables: [{ name: 'fuel_litres', value: 12.5, type: 'float' }],
    },
    {
      id: 'to_percentage',
      funcName: 'to_percentage',
      params: [{ name: 'fraction', type: 'float' }],
      bodyPython: 'def to_percentage(fraction):\n    return fraction * 100',
      run: ([fraction]) => fraction * 100,
      resultType: 'float',
      variables: [{ name: 'pass_rate', value: 0.875, type: 'float' }],
    },
    {
      id: 'discount_tenth',
      funcName: 'discount_tenth',
      params: [{ name: 'price', type: 'float' }],
      bodyPython: 'def discount_tenth(price):\n    return price - (price * 0.1)',
      run: ([price]) => Math.round((price - price * 0.1) * 100) / 100,
      resultType: 'float',
      variables: [{ name: 'ticket_price', value: 15.0, type: 'float' }],
    },
    {
      id: 'negate',
      funcName: 'negate',
      params: [{ name: 'flag', type: 'bool' }],
      bodyPython: 'def negate(flag):\n    return not flag',
      run: ([flag]) => !flag,
      resultType: 'bool',
      variables: [{ name: 'wifi_connected', value: false, type: 'bool' }],
    },
    {
      id: 'confirm',
      funcName: 'confirm',
      params: [{ name: 'agreed', type: 'bool' }],
      bodyPython: 'def confirm(agreed):\n    return "Confirmed" if agreed else "Declined"',
      run: ([agreed]) => (agreed ? 'Confirmed' : 'Declined'),
      resultType: 'str',
      variables: [{ name: 'terms_accepted', value: true, type: 'bool' }],
    },
    {
      id: 'toggle_alarm',
      funcName: 'toggle_alarm',
      params: [{ name: 'is_set', type: 'bool' }],
      bodyPython: 'def toggle_alarm(is_set):\n    return not is_set',
      run: ([isSet]) => !isSet,
      resultType: 'bool',
      variables: [{ name: 'alarm_on', value: true, type: 'bool' }],
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
    {
      id: 'make_tag',
      funcName: 'make_tag',
      params: [{ name: 'name', type: 'str' }, { name: 'id', type: 'int' }],
      bodyPython: 'def make_tag(name, id):\n    return f"{name}#{id}"',
      run: ([name, id]) => `${name}#${id}`,
      resultType: 'str',
      variables: [
        { name: 'label', value: 'Player', type: 'str' },
        { name: 'num', value: 7, type: 'int' },
      ],
    },
    {
      id: 'ticket_label',
      funcName: 'ticket_label',
      params: [{ name: 'event', type: 'str' }, { name: 'seat', type: 'int' }],
      bodyPython: 'def ticket_label(event, seat):\n    return f"{event} - Seat {seat}"',
      run: ([event, seat]) => `${event} - Seat ${seat}`,
      resultType: 'str',
      variables: [
        { name: 'show', value: 'Concert', type: 'str' },
        { name: 'seat_no', value: 14, type: 'int' },
      ],
    },
    {
      id: 'clap_count',
      funcName: 'clap_count',
      params: [{ name: 'sound', type: 'str' }, { name: 'beats', type: 'int' }],
      bodyPython: 'def clap_count(sound, beats):\n    return sound * beats',
      run: ([sound, beats]) => String(sound).repeat(beats),
      resultType: 'str',
      variables: [
        { name: 'noise', value: 'Clap ', type: 'str' },
        { name: 'beat_count', value: 4, type: 'int' },
      ],
    },
    {
      id: 'total_weight',
      funcName: 'total_weight',
      params: [{ name: 'bags', type: 'int' }, { name: 'weight_each', type: 'float' }],
      bodyPython: 'def total_weight(bags, weight_each):\n    return bags * weight_each',
      run: ([bags, weightEach]) => Math.round(bags * weightEach * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'items', value: 3, type: 'int' },
        { name: 'kg_each', value: 2.5, type: 'float' },
      ],
    },
    {
      id: 'average_speed',
      funcName: 'average_speed',
      params: [{ name: 'laps', type: 'int' }, { name: 'lap_time', type: 'float' }],
      bodyPython: 'def average_speed(laps, lap_time):\n    return laps * lap_time',
      run: ([laps, lapTime]) => Math.round(laps * lapTime * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'reps', value: 4, type: 'int' },
        { name: 'seconds_each', value: 32.5, type: 'float' },
      ],
    },
    {
      id: 'fuel_needed',
      funcName: 'fuel_needed',
      params: [{ name: 'miles', type: 'int' }, { name: 'rate', type: 'float' }],
      bodyPython: 'def fuel_needed(miles, rate):\n    return miles * rate',
      run: ([miles, rate]) => Math.round(miles * rate * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'distance', value: 120, type: 'int' },
        { name: 'litres_per_mile', value: 0.08, type: 'float' },
      ],
    },
    {
      id: 'eligible_for_discount',
      funcName: 'eligible_for_discount',
      params: [{ name: 'age', type: 'int' }, { name: 'is_student', type: 'bool' }],
      bodyPython: 'def eligible_for_discount(age, is_student):\n    return age < 18 or is_student',
      run: ([age, isStudent]) => age < 18 || isStudent,
      resultType: 'bool',
      variables: [
        { name: 'years', value: 20, type: 'int' },
        { name: 'has_id', value: true, type: 'bool' },
      ],
    },
    {
      id: 'grade_pass',
      funcName: 'grade_pass',
      params: [{ name: 'mark', type: 'int' }, { name: 'resit', type: 'bool' }],
      bodyPython: 'def grade_pass(mark, resit):\n    return mark >= 40 and not resit',
      run: ([mark, resit]) => mark >= 40 && !resit,
      resultType: 'bool',
      variables: [
        { name: 'score', value: 55, type: 'int' },
        { name: 'needs_resit', value: false, type: 'bool' },
      ],
    },
    {
      id: 'can_enter',
      funcName: 'can_enter',
      params: [{ name: 'age', type: 'int' }, { name: 'has_ticket', type: 'bool' }],
      bodyPython: 'def can_enter(age, has_ticket):\n    return age >= 12 and has_ticket',
      run: ([age, hasTicket]) => age >= 12 && hasTicket,
      resultType: 'bool',
      variables: [
        { name: 'visitor_age', value: 15, type: 'int' },
        { name: 'ticket_bought', value: true, type: 'bool' },
      ],
    },
    {
      id: 'weather_report',
      funcName: 'weather_report',
      params: [{ name: 'place', type: 'str' }, { name: 'temp', type: 'float' }],
      bodyPython: 'def weather_report(place, temp):\n    return f"{place}: {temp} degrees"',
      run: ([place, temp]) => `${place}: ${temp} degrees`,
      resultType: 'str',
      variables: [
        { name: 'location', value: 'Exmouth', type: 'str' },
        { name: 'reading', value: 14.2, type: 'float' },
      ],
    },
    {
      id: 'fuel_price',
      funcName: 'fuel_price',
      params: [{ name: 'fuel_type', type: 'str' }, { name: 'price', type: 'float' }],
      bodyPython: 'def fuel_price(fuel_type, price):\n    return f"{fuel_type} costs £{price} per litre"',
      run: ([fuelType, price]) => `${fuelType} costs £${price} per litre`,
      resultType: 'str',
      variables: [
        { name: 'kind', value: 'Diesel', type: 'str' },
        { name: 'cost', value: 1.55, type: 'float' },
      ],
    },
    {
      id: 'race_time',
      funcName: 'race_time',
      params: [{ name: 'runner', type: 'str' }, { name: 'seconds', type: 'float' }],
      bodyPython: 'def race_time(runner, seconds):\n    return f"{runner} finished in {seconds}s"',
      run: ([runner, seconds]) => `${runner} finished in ${seconds}s`,
      resultType: 'str',
      variables: [
        { name: 'athlete', value: 'Jo', type: 'str' },
        { name: 'finish', value: 58.3, type: 'float' },
      ],
    },
    {
      id: 'library_status',
      funcName: 'library_status',
      params: [{ name: 'book', type: 'str' }, { name: 'is_available', type: 'bool' }],
      bodyPython: 'def library_status(book, is_available):\n    return f"{book} is available" if is_available else f"{book} is out"',
      run: ([book, isAvailable]) => (isAvailable ? `${book} is available` : `${book} is out`),
      resultType: 'str',
      variables: [
        { name: 'title', value: 'Python Basics', type: 'str' },
        { name: 'in_stock', value: true, type: 'bool' },
      ],
    },
    {
      id: 'homework_status',
      funcName: 'homework_status',
      params: [{ name: 'task', type: 'str' }, { name: 'submitted', type: 'bool' }],
      bodyPython: 'def homework_status(task, submitted):\n    return f"{task}: Submitted" if submitted else f"{task}: Missing"',
      run: ([task, submitted]) => (submitted ? `${task}: Submitted` : `${task}: Missing`),
      resultType: 'str',
      variables: [
        { name: 'assignment', value: 'Loop practice', type: 'str' },
        { name: 'handed_in', value: false, type: 'bool' },
      ],
    },
    {
      id: 'club_member',
      funcName: 'club_member',
      params: [{ name: 'club', type: 'str' }, { name: 'active', type: 'bool' }],
      bodyPython: 'def club_member(club, active):\n    return f"{club} (Active)" if active else club',
      run: ([club, active]) => (active ? `${club} (Active)` : club),
      resultType: 'str',
      variables: [
        { name: 'society', value: 'Coding Club', type: 'str' },
        { name: 'paid', value: true, type: 'bool' },
      ],
    },
    {
      id: 'apply_service_charge',
      funcName: 'apply_service_charge',
      params: [{ name: 'bill', type: 'float' }, { name: 'add_charge', type: 'bool' }],
      bodyPython: 'def apply_service_charge(bill, add_charge):\n    return round(bill * 1.1, 2) if add_charge else bill',
      run: ([bill, addCharge]) => (addCharge ? Math.round(bill * 1.1 * 100) / 100 : bill),
      resultType: 'float',
      variables: [
        { name: 'total', value: 24.0, type: 'float' },
        { name: 'service_included', value: true, type: 'bool' },
      ],
    },
    {
      id: 'battery_warning',
      funcName: 'battery_warning',
      params: [{ name: 'charge', type: 'float' }, { name: 'is_charging', type: 'bool' }],
      bodyPython: 'def battery_warning(charge, is_charging):\n    return charge < 20 and not is_charging',
      run: ([charge, isCharging]) => charge < 20 && !isCharging,
      resultType: 'bool',
      variables: [
        { name: 'percent', value: 15.5, type: 'float' },
        { name: 'plugged_in', value: false, type: 'bool' },
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
    {
      id: 'petrol_cost',
      funcName: 'petrol_cost',
      params: [{ name: 'car', type: 'str' }, { name: 'litres', type: 'int' }, { name: 'price_per_litre', type: 'float' }],
      bodyPython: 'def petrol_cost(car, litres, price_per_litre):\n    return f"{car}: £{litres * price_per_litre:.2f}"',
      run: ([car, litres, pricePerLitre]) => `${car}: £${(litres * pricePerLitre).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'vehicle', value: 'Van', type: 'str' },
        { name: 'litres_bought', value: 30, type: 'int' },
        { name: 'pump_price', value: 1.48, type: 'float' },
      ],
    },
    {
      id: 'taxi_fare',
      funcName: 'taxi_fare',
      params: [{ name: 'driver', type: 'str' }, { name: 'miles', type: 'int' }, { name: 'rate', type: 'float' }],
      bodyPython: 'def taxi_fare(driver, miles, rate):\n    return f"{driver}: £{miles * rate:.2f}"',
      run: ([driver, miles, rate]) => `${driver}: £${(miles * rate).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'name', value: 'Sam', type: 'str' },
        { name: 'trip_miles', value: 6, type: 'int' },
        { name: 'fare_per_mile', value: 2.1, type: 'float' },
      ],
    },
    {
      id: 'print_job',
      funcName: 'print_job',
      params: [{ name: 'document', type: 'str' }, { name: 'pages', type: 'int' }, { name: 'cost_per_page', type: 'float' }],
      bodyPython: 'def print_job(document, pages, cost_per_page):\n    return f"{document}: £{pages * cost_per_page:.2f}"',
      run: ([document, pages, costPerPage]) => `${document}: £${(pages * costPerPage).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'file_name', value: 'Assignment', type: 'str' },
        { name: 'page_count', value: 12, type: 'int' },
        { name: 'price_each', value: 0.05, type: 'float' },
      ],
    },
    {
      id: 'market_stall',
      funcName: 'market_stall',
      params: [{ name: 'stall', type: 'str' }, { name: 'kilos', type: 'int' }, { name: 'price_per_kilo', type: 'float' }],
      bodyPython: 'def market_stall(stall, kilos, price_per_kilo):\n    return f"{stall}: £{kilos * price_per_kilo:.2f}"',
      run: ([stall, kilos, pricePerKilo]) => `${stall}: £${(kilos * pricePerKilo).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'seller', value: 'Fruit Stand', type: 'str' },
        { name: 'weight', value: 4, type: 'int' },
        { name: 'rate', value: 1.35, type: 'float' },
      ],
    },
    {
      id: 'match_result',
      funcName: 'match_result',
      params: [{ name: 'team', type: 'str' }, { name: 'goals', type: 'int' }, { name: 'won', type: 'bool' }],
      bodyPython: 'def match_result(team, goals, won):\n    return f"{team} scored {goals} - {\'Win\' if won else \'Loss\'}"',
      run: ([team, goals, won]) => `${team} scored ${goals} - ${won ? 'Win' : 'Loss'}`,
      resultType: 'str',
      variables: [
        { name: 'side', value: 'Exeter City', type: 'str' },
        { name: 'goals_scored', value: 3, type: 'int' },
        { name: 'victory', value: true, type: 'bool' },
      ],
    },
    {
      id: 'quiz_result',
      funcName: 'quiz_result',
      params: [{ name: 'student', type: 'str' }, { name: 'correct', type: 'int' }, { name: 'passed', type: 'bool' }],
      bodyPython: 'def quiz_result(student, correct, passed):\n    return f"{student}: {correct} correct - {\'Pass\' if passed else \'Fail\'}"',
      run: ([student, correct, passed]) => `${student}: ${correct} correct - ${passed ? 'Pass' : 'Fail'}`,
      resultType: 'str',
      variables: [
        { name: 'pupil_name', value: 'Ravi', type: 'str' },
        { name: 'correct_answers', value: 8, type: 'int' },
        { name: 'has_passed', value: true, type: 'bool' },
      ],
    },
    {
      id: 'delivery_note',
      funcName: 'delivery_note',
      params: [{ name: 'customer', type: 'str' }, { name: 'parcels', type: 'int' }, { name: 'signed', type: 'bool' }],
      bodyPython: 'def delivery_note(customer, parcels, signed):\n    return f"{customer}: {parcels} parcel(s) - {\'Signed\' if signed else \'Pending\'}"',
      run: ([customer, parcels, signed]) => `${customer}: ${parcels} parcel(s) - ${signed ? 'Signed' : 'Pending'}`,
      resultType: 'str',
      variables: [
        { name: 'recipient', value: 'Mrs Patel', type: 'str' },
        { name: 'parcel_count', value: 2, type: 'int' },
        { name: 'is_signed', value: false, type: 'bool' },
      ],
    },
    {
      id: 'attendance_note',
      funcName: 'attendance_note',
      params: [{ name: 'student', type: 'str' }, { name: 'sessions', type: 'int' }, { name: 'present', type: 'bool' }],
      bodyPython: 'def attendance_note(student, sessions, present):\n    return f"{student}: {sessions} sessions - {\'Present\' if present else \'Absent\'}"',
      run: ([student, sessions, present]) => `${student}: ${sessions} sessions - ${present ? 'Present' : 'Absent'}`,
      resultType: 'str',
      variables: [
        { name: 'learner', value: 'Jodie', type: 'str' },
        { name: 'session_count', value: 10, type: 'int' },
        { name: 'in_class', value: true, type: 'bool' },
      ],
    },
    {
      id: 'parking_fee',
      funcName: 'parking_fee',
      params: [{ name: 'hours', type: 'int' }, { name: 'rate', type: 'float' }, { name: 'is_permit_holder', type: 'bool' }],
      bodyPython: 'def parking_fee(hours, rate, is_permit_holder):\n    discount = 0.5 if is_permit_holder else 1\n    return round(hours * rate * discount, 2)',
      run: ([hours, rate, isPermitHolder]) => Math.round(hours * rate * (isPermitHolder ? 0.5 : 1) * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'duration', value: 3, type: 'int' },
        { name: 'hourly_rate', value: 1.8, type: 'float' },
        { name: 'has_permit', value: true, type: 'bool' },
      ],
    },
    {
      id: 'gym_session_cost',
      funcName: 'gym_session_cost',
      params: [{ name: 'sessions', type: 'int' }, { name: 'price', type: 'float' }, { name: 'is_member', type: 'bool' }],
      bodyPython: 'def gym_session_cost(sessions, price, is_member):\n    discount = 0.75 if is_member else 1\n    return round(sessions * price * discount, 2)',
      run: ([sessions, price, isMember]) => Math.round(sessions * price * (isMember ? 0.75 : 1) * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'visits', value: 5, type: 'int' },
        { name: 'price_each', value: 8.0, type: 'float' },
        { name: 'member_card', value: true, type: 'bool' },
      ],
    },
    {
      id: 'delivery_cost',
      funcName: 'delivery_cost',
      params: [{ name: 'boxes', type: 'int' }, { name: 'weight_rate', type: 'float' }, { name: 'is_express', type: 'bool' }],
      bodyPython: 'def delivery_cost(boxes, weight_rate, is_express):\n    surcharge = 1.5 if is_express else 1\n    return round(boxes * weight_rate * surcharge, 2)',
      run: ([boxes, weightRate, isExpress]) => Math.round(boxes * weightRate * (isExpress ? 1.5 : 1) * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'packages', value: 6, type: 'int' },
        { name: 'rate_per_box', value: 2.2, type: 'float' },
        { name: 'fast_delivery', value: false, type: 'bool' },
      ],
    },
    {
      id: 'exam_resit_fee',
      funcName: 'exam_resit_fee',
      params: [{ name: 'attempts', type: 'int' }, { name: 'base_fee', type: 'float' }, { name: 'is_discounted', type: 'bool' }],
      bodyPython: 'def exam_resit_fee(attempts, base_fee, is_discounted):\n    discount = 0.8 if is_discounted else 1\n    return round(attempts * base_fee * discount, 2)',
      run: ([attempts, baseFee, isDiscounted]) => Math.round(attempts * baseFee * (isDiscounted ? 0.8 : 1) * 100) / 100,
      resultType: 'float',
      variables: [
        { name: 'resit_count', value: 2, type: 'int' },
        { name: 'fee_each', value: 25.0, type: 'float' },
        { name: 'eligible', value: true, type: 'bool' },
      ],
    },
    {
      id: 'menu_price',
      funcName: 'menu_price',
      params: [{ name: 'dish', type: 'str' }, { name: 'price', type: 'float' }, { name: 'is_special', type: 'bool' }],
      bodyPython: 'def menu_price(dish, price, is_special):\n    final_price = price * 0.85 if is_special else price\n    return f"{dish}: £{final_price:.2f}"',
      run: ([dish, price, isSpecial]) => `${dish}: £${(isSpecial ? price * 0.85 : price).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'meal_name', value: 'Curry', type: 'str' },
        { name: 'base_price', value: 7.5, type: 'float' },
        { name: 'today_special', value: true, type: 'bool' },
      ],
    },
    {
      id: 'hotel_rate',
      funcName: 'hotel_rate',
      params: [{ name: 'room', type: 'str' }, { name: 'price', type: 'float' }, { name: 'is_peak_season', type: 'bool' }],
      bodyPython: 'def hotel_rate(room, price, is_peak_season):\n    final_price = price * 1.2 if is_peak_season else price\n    return f"{room}: £{final_price:.2f}"',
      run: ([room, price, isPeakSeason]) => `${room}: £${(isPeakSeason ? price * 1.2 : price).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'room_type', value: 'Double', type: 'str' },
        { name: 'nightly_rate', value: 60.0, type: 'float' },
        { name: 'peak', value: false, type: 'bool' },
      ],
    },
    {
      id: 'taxi_night_rate',
      funcName: 'taxi_night_rate',
      params: [{ name: 'driver', type: 'str' }, { name: 'fare', type: 'float' }, { name: 'is_night', type: 'bool' }],
      bodyPython: 'def taxi_night_rate(driver, fare, is_night):\n    final_fare = fare * 1.25 if is_night else fare\n    return f"{driver}: £{final_fare:.2f}"',
      run: ([driver, fare, isNight]) => `${driver}: £${(isNight ? fare * 1.25 : fare).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'cabbie', value: 'Priya', type: 'str' },
        { name: 'standard_fare', value: 12.0, type: 'float' },
        { name: 'after_midnight', value: true, type: 'bool' },
      ],
    },
    {
      id: 'ticket_price_label',
      funcName: 'ticket_price_label',
      params: [{ name: 'event', type: 'str' }, { name: 'price', type: 'float' }, { name: 'is_student_ticket', type: 'bool' }],
      bodyPython: 'def ticket_price_label(event, price, is_student_ticket):\n    final_price = price * 0.5 if is_student_ticket else price\n    return f"{event}: £{final_price:.2f}"',
      run: ([event, price, isStudentTicket]) => `${event}: £${(isStudentTicket ? price * 0.5 : price).toFixed(2)}`,
      resultType: 'str',
      variables: [
        { name: 'gig_name', value: 'Open Mic', type: 'str' },
        { name: 'full_price', value: 10.0, type: 'float' },
        { name: 'student_rate', value: true, type: 'bool' },
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

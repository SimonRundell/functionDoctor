import { useEffect, useState } from 'react';
import { pickExercise, buildChipPool } from '../data/exercises.js';
import { shuffle, shuffledOrder, formatPyValue } from '../utils.js';

/** Rounds are played in this order: 1 parameter, then 2, then 3. */
const ARITIES = [1, 2, 3];

/**
 * Owns all state and transitions for a Function Doctor playthrough: which
 * screen is showing, the current exercise and chip pool, the positional and
 * keyword-argument call slots, and the running mistake/result tallies.
 * @returns {Object} game state and handlers consumed by App.jsx
 */
export function useFunctionGame() {
  const [screen, setScreen] = useState('start'); // 'start' | 'playing' | 'summary'
  const [roundNumber, setRoundNumber] = useState(0); // index into ARITIES
  const [exercise, setExercise] = useState(null);
  const [chips, setChips] = useState([]);
  const [stage, setStage] = useState('positional'); // 'positional' | 'keyword'
  const [positionalSlots, setPositionalSlots] = useState([]); // chipKey|null, definition order
  const [keywordOrder, setKeywordOrder] = useState([]); // shuffled param indices
  const [keywordSlots, setKeywordSlots] = useState([]); // chipKey|null, keywordOrder order
  const [selectedChipKey, setSelectedChipKey] = useState(null);
  const [errorSlot, setErrorSlot] = useState(null);
  const [roundMistakes, setRoundMistakes] = useState(0);
  const [totalMistakes, setTotalMistakes] = useState(0);
  const [roundResults, setRoundResults] = useState([]);

  // Clear the transient "wrong type" shake after a moment.
  useEffect(() => {
    if (errorSlot === null) return undefined;
    const timer = setTimeout(() => setErrorSlot(null), 450);
    return () => clearTimeout(timer);
  }, [errorSlot]);

  /** @param {string} key @returns {Object|undefined} */
  function findChip(key) {
    return chips.find((c) => c.key === key);
  }

  /**
   * Loads a new exercise for the given arity and resets all round state.
   * @param {number} arity
   * @param {string|null} [excludeId]
   */
  function startRound(arity, excludeId = null) {
    const ex = pickExercise(arity, excludeId);
    setExercise(ex);
    setChips(buildChipPool(ex));
    setStage('positional');
    setPositionalSlots(Array(ex.params.length).fill(null));
    setKeywordOrder(shuffledOrder(ex.params.length));
    setKeywordSlots(Array(ex.params.length).fill(null));
    setSelectedChipKey(null);
    setErrorSlot(null);
    setRoundMistakes(0);
  }

  function handleStart() {
    setTotalMistakes(0);
    setRoundResults([]);
    setRoundNumber(0);
    startRound(ARITIES[0]);
    setScreen('playing');
  }

  function handleShuffleExercise() {
    startRound(ARITIES[roundNumber], exercise.id);
  }

  /**
   * Attempts to drop the chip with `chipKey` into slot `index` of the
   * active stage. Rejects (with a shake and a mistake tally) on a type
   * mismatch; otherwise places it.
   * @param {number} index
   * @param {string} chipKey
   */
  function handleAttemptPlace(index, chipKey) {
    if (!chipKey) return;
    const chip = findChip(chipKey);
    if (!chip) return;

    const activeParam = stage === 'positional' ? exercise.params[index] : exercise.params[keywordOrder[index]];

    if (chip.type !== activeParam.type) {
      setErrorSlot(index);
      setRoundMistakes((m) => m + 1);
      setTotalMistakes((m) => m + 1);
      setSelectedChipKey(null);
      return;
    }

    const setSlots = stage === 'positional' ? setPositionalSlots : setKeywordSlots;
    setSlots((prev) => prev.map((v, i) => (i === index ? chipKey : v)));
    setSelectedChipKey(null);
  }

  /** Returns a chip that's currently placed in a slot to the pool. */
  function handleUnplace(index) {
    const setSlots = stage === 'positional' ? setPositionalSlots : setKeywordSlots;
    setSlots((prev) => prev.map((v, i) => (i === index ? null : v)));
  }

  function handleSlotClick(index) {
    const activeSlots = stage === 'positional' ? positionalSlots : keywordSlots;
    if (activeSlots[index]) {
      handleUnplace(index);
      return;
    }
    if (selectedChipKey) handleAttemptPlace(index, selectedChipKey);
  }

  function handleChipSelect(chipKey) {
    setSelectedChipKey((prev) => (prev === chipKey ? null : chipKey));
  }

  /** @param {React.DragEvent} event @param {string} chipKey */
  function handleChipDragStart(event, chipKey) {
    event.dataTransfer.setData('text/plain', chipKey);
  }

  function handleStageAdvance() {
    if (stage === 'positional') {
      setChips((prev) => shuffle(prev));
      setStage('keyword');
      return;
    }

    const argsInParamOrder = exercise.params.map((_, i) => findChip(positionalSlots[i])?.value);
    const output = exercise.run(argsInParamOrder);
    setRoundResults((prev) => [
      ...prev,
      { funcName: exercise.funcName, output: formatPyValue(output, exercise.resultType) },
    ]);

    if (roundNumber < ARITIES.length - 1) {
      const next = roundNumber + 1;
      setRoundNumber(next);
      startRound(ARITIES[next]);
    } else {
      setScreen('summary');
    }
  }

  const activeSlots = stage === 'positional' ? positionalSlots : keywordSlots;
  const stageComplete = Boolean(exercise) && activeSlots.length > 0 && activeSlots.every(Boolean);
  const placedKeys = new Set(activeSlots.filter(Boolean));

  const slotDescriptors = !exercise
    ? []
    : stage === 'positional'
      ? exercise.params.map((param, i) => ({
          key: param.name,
          label: null,
          chip: positionalSlots[i] ? findChip(positionalSlots[i]) : null,
        }))
      : keywordOrder.map((paramIndex, i) => ({
          key: exercise.params[paramIndex].name,
          label: exercise.params[paramIndex].name,
          chip: keywordSlots[i] ? findChip(keywordSlots[i]) : null,
        }));

  const argNamesUsed =
    stageComplete && stage === 'positional' && exercise
      ? exercise.params.map((_, i) => findChip(positionalSlots[i])?.name)
      : [];
  const paramNames = exercise ? exercise.params.map((p) => p.name) : [];

  return {
    screen,
    roundNumber,
    arities: ARITIES,
    exercise,
    chips,
    stage,
    selectedChipKey,
    errorSlot,
    roundMistakes,
    totalMistakes,
    roundResults,
    stageComplete,
    placedKeys,
    slotDescriptors,
    argNamesUsed,
    paramNames,
    handleStart,
    handleShuffleExercise,
    handleAttemptPlace,
    handleSlotClick,
    handleChipSelect,
    handleChipDragStart,
    handleStageAdvance,
  };
}

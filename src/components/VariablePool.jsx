import { formatPyValue } from '../utils.js';

/**
 * The pool of draggable variable chips a student can place into call slots.
 * A chip disappears from the pool once it has been placed into a slot.
 *
 * @param {Object} props
 * @param {Array<{key: string, name: string, value: *, type: string}>} props.chips
 * @param {Set<string>} props.placedKeys - keys of chips currently sitting in a slot
 * @param {string|null} props.selectedKey - key of the chip selected for click-to-place
 * @param {(key: string) => void} props.onSelect
 * @param {(event: React.DragEvent, key: string) => void} props.onDragStart
 * @returns {JSX.Element}
 */
export default function VariablePool({ chips, placedKeys, selectedKey, onSelect, onDragStart }) {
  return (
    <div className="variable-pool">
      {chips.map((chip) => {
        if (placedKeys.has(chip.key)) return null;
        const isSelected = selectedKey === chip.key;
        return (
          <button
            key={chip.key}
            type="button"
            draggable
            className={`chip chip--${chip.type}${isSelected ? ' chip--selected' : ''}`}
            onDragStart={(event) => onDragStart(event, chip.key)}
            onClick={() => onSelect(chip.key)}
          >
            <code className="chip__code">
              {chip.name} = {formatPyValue(chip.value, chip.type)}
            </code>
            <span className="chip__type">{chip.type}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Renders a Python function call as a row of drop targets, e.g.
 * `order_total(____, ____, ____)` or, in keyword mode, `order_total(price=____, item=____)`.
 *
 * @param {Object} props
 * @param {string} props.funcName
 * @param {Array<{ key: string, label: string|null, chip: {name: string}|null }>} props.slots
 * @param {number|null} props.errorIndex - slot currently showing a type-mismatch shake
 * @param {(index: number, chipKey: string) => void} props.onDrop
 * @param {(index: number) => void} props.onClickSlot
 * @returns {JSX.Element}
 */
export default function CallBuilder({ funcName, slots, errorIndex, onDrop, onClickSlot }) {
  return (
    <code className="call-builder">
      <span className="call-builder__func">{funcName}</span>(
      {slots.map((slot, index) => (
        <span key={slot.key} className="call-builder__arg">
          {slot.label && <span className="call-builder__label">{slot.label}=</span>}
          <button
            type="button"
            className={[
              'call-slot',
              slot.chip && 'call-slot--filled',
              errorIndex === index && 'call-slot--error',
            ]
              .filter(Boolean)
              .join(' ')}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              onDrop(index, event.dataTransfer.getData('text/plain'));
            }}
            onClick={() => onClickSlot(index)}
          >
            {slot.chip ? slot.chip.name : '____'}
          </button>
          {index < slots.length - 1 && ', '}
        </span>
      ))}
      )
    </code>
  );
}

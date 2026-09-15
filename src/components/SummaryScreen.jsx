/**
 * End-of-game recap showing the functions the student called and a
 * replay button that reshuffles fresh random exercises.
 * @param {Object} props
 * @param {Array<{funcName: string, output: string}>} props.results
 * @param {number} props.totalMistakes
 * @param {() => void} props.onRestart
 * @returns {JSX.Element}
 */
export default function SummaryScreen({ results, totalMistakes, onRestart }) {
  return (
    <div className="screen-card">
      <h1>Nice work!</h1>
      <p className="lede">You called {results.length} functions, positionally and by keyword.</p>
      <ul className="summary-list">
        {results.map((result) => (
          <li key={result.funcName}>
            <code>{result.funcName}(...)</code>
            <span className="summary-list__arrow">&rarr;</span>
            <code>{result.output}</code>
          </li>
        ))}
      </ul>
      <p className="summary-mistakes">
        {totalMistakes === 0
          ? 'You matched every argument type first time.'
          : `Type-mismatched drops: ${totalMistakes}. Have another go to beat that.`}
      </p>
      <button type="button" className="btn btn--primary" onClick={onRestart}>
        Play again
      </button>
    </div>
  );
}

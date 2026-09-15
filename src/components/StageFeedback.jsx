/**
 * Success panel shown once every slot in the active stage is correctly
 * filled. Explains what just happened and offers the next step.
 *
 * @param {Object} props
 * @param {'positional'|'keyword'} props.stage
 * @param {string} props.funcName
 * @param {string[]} props.argNamesUsed - argument names, in the order dropped (positional stage only)
 * @param {string[]} props.paramNames - parameter names in definition order
 * @param {boolean} props.isLastRound
 * @param {() => void} props.onAdvance
 * @returns {JSX.Element}
 */
export default function StageFeedback({ stage, funcName, argNamesUsed, paramNames, isLastRound, onAdvance }) {
  if (stage === 'positional') {
    return (
      <div className="feedback feedback--success">
        <p>
          <strong>Correct!</strong> You called <code>{funcName}({argNamesUsed.join(', ')})</code>, but the function
          was defined as <code>def {funcName}({paramNames.join(', ')}):</code>
        </p>
        <p>
          The parameter names ({paramNames.join(', ')}) and the argument names you used ({argNamesUsed.join(', ')})
          do not match, and that is fine. Python matched them by <strong>position</strong>: the first argument
          filled the first parameter, and so on.
        </p>
        <button type="button" className="btn btn--primary" onClick={onAdvance}>
          Try the keyword-argument version
        </button>
      </div>
    );
  }

  return (
    <div className="feedback feedback--success">
      <p>
        <strong>Correct!</strong> This time you named each parameter directly with <code>param=value</code>, so the
        order you placed them in did not matter. Python still matched every argument to the right parameter.
      </p>
      <button type="button" className="btn btn--primary" onClick={onAdvance}>
        {isLastRound ? 'See your results' : 'Next round'}
      </button>
    </div>
  );
}

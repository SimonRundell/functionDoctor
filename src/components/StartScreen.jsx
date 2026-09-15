/**
 * Landing screen explaining the game before the first round starts.
 * @param {Object} props
 * @param {() => void} props.onStart
 * @returns {JSX.Element}
 */
export default function StartScreen({ onStart }) {
  return (
    <div className="screen-card">
      <img src="/functionDoctor.png" alt="Function Doctor logo" className="app-logo" />
      <h1>Function Doctor</h1>
      <p className="lede">Practise calling Python functions with the right arguments.</p>
      <ul className="rules">
        <li>Each round shows you a Python function and a pool of variables.</li>
        <li>Drag (or tap, then tap a slot) the variables into the call so their types match the parameters.</li>
        <li>Round 1 uses one parameter, round 2 uses two, round 3 uses three.</li>
        <li>After each call, you will try it again using keyword arguments.</li>
      </ul>
      <button type="button" className="btn btn--primary" onClick={onStart}>
        Start
      </button>
    </div>
  );
}

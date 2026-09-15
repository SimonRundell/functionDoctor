import CMFloatAd from './CMFloatAd.jsx';
import StartScreen from './components/StartScreen.jsx';
import SummaryScreen from './components/SummaryScreen.jsx';
import VariablePool from './components/VariablePool.jsx';
import CallBuilder from './components/CallBuilder.jsx';
import StageFeedback from './components/StageFeedback.jsx';
import { useFunctionGame } from './hooks/useFunctionGame.js';
import './App.css';

/**
 * Top-level component. Game state and logic live in useFunctionGame; this
 * component only picks which screen to render.
 * @returns {JSX.Element}
 */
function App() {
  const game = useFunctionGame();

  if (game.screen === 'start') {
    return (
      <>
        <StartScreen onStart={game.handleStart} />
        <CMFloatAd />
      </>
    );
  }

  if (game.screen === 'summary') {
    return (
      <>
        <SummaryScreen results={game.roundResults} totalMistakes={game.totalMistakes} onRestart={game.handleStart} />
        <CMFloatAd />
      </>
    );
  }

  const { exercise, stage } = game;
  const arity = game.arities[game.roundNumber];

  return (
    <>
      <main className="game">
        <header className="game__header">
          <img src="/functionDoctor.png" alt="Function Doctor logo" className="game__logo" />
          <div>
            <h1>Function Doctor</h1>
            <p className="game__progress">
              Round {game.roundNumber + 1} of {game.arities.length} &middot; {arity} parameter{arity > 1 ? 's' : ''}
            </p>
          </div>
        </header>

        <section className="function-panel">
          <div className="function-panel__head">
            <h2>The function</h2>
            <button type="button" className="btn btn--ghost" onClick={game.handleShuffleExercise}>
              Try a different example
            </button>
          </div>
          <pre className="python-code">
            <code>{exercise.bodyPython}</code>
          </pre>

          <h2>Your variables</h2>
          <p className="hint">Drag a variable into the call below, or tap one then tap a slot.</p>
          <VariablePool
            chips={game.chips}
            placedKeys={game.placedKeys}
            selectedKey={game.selectedChipKey}
            onSelect={game.handleChipSelect}
            onDragStart={game.handleChipDragStart}
          />

          <h2>{stage === 'positional' ? 'Call it' : 'Now call it with keyword arguments'}</h2>
          <CallBuilder
            funcName={exercise.funcName}
            slots={game.slotDescriptors}
            errorIndex={game.errorSlot}
            onDrop={game.handleAttemptPlace}
            onClickSlot={game.handleSlotClick}
          />

          {game.errorSlot !== null && (
            <p className="feedback feedback--error">
              That variable's type does not match this parameter. Check the type label on each chip.
            </p>
          )}

          {game.stageComplete && (
            <StageFeedback
              stage={stage}
              funcName={exercise.funcName}
              argNamesUsed={game.argNamesUsed}
              paramNames={game.paramNames}
              isLastRound={game.roundNumber === game.arities.length - 1}
              onAdvance={game.handleStageAdvance}
            />
          )}

          {game.roundMistakes > 0 && (
            <p className="mistake-count">Mismatched drops this round: {game.roundMistakes}</p>
          )}
        </section>
      </main>
      <CMFloatAd />
    </>
  );
}

export default App;

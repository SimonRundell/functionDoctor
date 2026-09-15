# Function Doctor

A drag-and-drop teaching aid for practising how arguments are passed into Python functions. Built for Exeter College, Dept of Cybersecurity and Digital Technologies.

Students are shown a Python function and a pool of variables of different types (`int`, `float`, `str`, `bool`). They drag (or tap-to-select, tap-to-place) the correct variable into each blank of a function call, first positionally and then using keyword arguments, across three rounds of increasing arity (1, 2, then 3 parameters).

## What it teaches

- Calling a function with one, two and three arguments.
- Matching argument **type** to parameter type and position.
- That an argument's name in the caller does not need to match the parameter's name in the `def` line.
- That keyword arguments (`param=value`) can be given in any order, because Python matches them by name rather than position.

## Tech stack

Plain JavaScript, React + Vite, no TypeScript. No backend and nothing is persisted — it's a single self-contained front end that runs entirely in the browser. There is no PHP/MySQL layer because there's no data to store; every playthrough starts fresh.

## Local development

```
npm install
npm run dev
```

Vite serves the app on a local port (printed in the terminal) with hot module reload.

Other scripts:

```
npm run build    # production build to dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
npm run doctor   # react-doctor code health check
```

## Deployment

This is a static site — there's no server-side component to configure.

1. `npm run build` produces a `dist/` folder.
2. Upload the contents of `dist/` to the web root (or subfolder) on the host.

If it's deployed into a subfolder rather than the domain root (e.g. `https://example.com/functiondoctor/`), set `base` in [vite.config.js](vite.config.js) to that subfolder path before building, otherwise the built asset URLs will 404:

```js
export default defineConfig({
  plugins: [react()],
  base: '/functiondoctor/',
})
```

No `.htaccess` or PHP configuration is needed since the app serves nothing but static HTML/CSS/JS.

## Project structure

```
src/
  App.jsx                 top-level screen switch (start / playing / summary)
  App.css                 all app styling (single stylesheet)
  CMFloatAd.jsx            Exeter College branding banner (self-contained, do not edit styling outside this file)
  hooks/useFunctionGame.js game state, round/stage transitions, scoring
  data/exercises.js        the exercise bank (see "Adding exercises" below)
  components/              presentational pieces: StartScreen, SummaryScreen, VariablePool, CallBuilder, StageFeedback
  utils.js                 shuffle, Python-style value formatting
```

## Adding or editing exercises

Exercises live in [src/data/exercises.js](src/data/exercises.js), grouped by arity (`1`, `2`, `3`). Each exercise needs:

- `params` — the parameter names and types, in definition order.
- `bodyPython` — the function source shown to the student (for reading only).
- `run` — a JS function that computes the same result, used to show the actual output once a call is completed correctly.
- `variables` — one correct variable per parameter, in the same order as `params`.

Distractor chips are pulled automatically from a shared pool (`DISTRACTOR_POOL`) and are always a type that doesn't match any parameter in the exercise, so type-matching a chip to a slot is always sufficient proof it's correct — no need to hand-craft distractors per exercise.

To keep the challenge meaningful, give each exercise's parameters **different** types from one another (e.g. `str` + `int`, not `str` + `str`), otherwise a wrong-but-same-type guess would still be accepted.

## Teaching notes

**Audience:** Level 2 Further Education students (~16 years old), early in a Python unit, after they've met functions but before or while covering multiple parameters and keyword arguments.

**Suggested use:**

1. Project the start screen and walk through round 1 as a class, thinking aloud about which chip fits which blank and why.
2. Let students work individually or in pairs for rounds 2 and 3, or click "Try a different example" to keep re-rolling round 1 for extra practice before moving on.
3. Use the keyword-argument stage of each round as the trigger for the "order doesn't matter" and "names don't have to match" discussion — the explanation panel states this explicitly after each correct call, but it's worth pausing on live.

**Formative, not graded:** mismatched drops are counted and shown per round and in the end-of-game summary, but there's no scoring or persistence. It's meant to surface misunderstandings in the moment, not to produce a mark.

**Extending the lesson:** once students are comfortable, have them predict the printed output before clicking through, or pause after a wrong-type rejection and ask them to explain why that chip didn't fit.

**Known limitation:** native drag-and-drop (mouse) works as expected; on touchscreens, dragging isn't supported by the browser's HTML5 drag API, so touch users should use the tap-to-select-then-tap-to-place alternative, which works identically.

## Licence

Released under Creative Commons Attribution-NonCommercial-ShareAlike 4.0: you're free to use and adapt this for non-commercial teaching purposes, with attribution and share-alike terms. Full terms: https://creativecommons.org/licenses/by-nc-sa/4.0/

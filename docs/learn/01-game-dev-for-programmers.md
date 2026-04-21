# 01 — Game Dev for Programmers

You know how to write code. What's different about writing game code?

Short version: your program is no longer a function that takes a request and returns a response. It's a **loop that never stops**, reading input, mutating state, and rendering pixels, 60 times a second. Getting used to that inversion is 80% of the mental shift.

## The game loop

Every game, ever, looks roughly like this:

```ts
while (gameIsRunning) {
  const deltaMs = time.elapsedSinceLastFrame();
  const intent = input.poll();
  state = tick(state, intent, deltaMs);
  render(state);
  time.waitForNextFrame();
}
```

Phaser hides the `while` loop. You give it scenes; it calls your `update(time, delta)` method about once every 16.67ms (60 FPS). Everything else flows from that.

## What transfers from your day job

| From | To | Why |
|---|---|---|
| Pure functions for business rules | Pure functions in `src/domain/` | Same reason: trivial to test, trivial to reason about |
| Dependency injection (ports/adapters) | Ports for time, random, storage, audio | The engine is a side-effect provider; you keep the core clean |
| Event-driven architecture | Typed event bus (`src/shared/events/`) | Same pattern, different consumers |
| State management (Redux, Zustand, etc.) | `GameState` aggregate + reducer-ish features | The ideas map 1:1 |
| Test-driven development | `src/**/*.test.ts` | Domain code is unit-testable even for games |
| Conventional commits + PR reviews | Same tooling, same discipline | You already do this |
| Observability / logging | Debug overlays, telemetry, analytics | The output shape differs; the instinct is the same |

**Your best existing skill is knowing where to draw abstraction lines.** This template already draws them in the right places — you just need to resist the urge to undo them when a tutorial shows you a Phaser-everything approach.

## What does NOT transfer (and surprises people)

### 1. Frames, not requests

In web dev, your code runs when something asks. In games, your code runs **constantly**. If your `update()` takes 20ms, you dropped a frame and the player sees stutter. Budget matters differently — "premature optimization" is less of a sin at the hot loop.

### 2. Mutation happens — intentionally

Phaser gives you `Sprite` objects. Those objects are mutable: `sprite.x = 42` is the norm, not an anti-pattern. The template quarantines the mutable engine work in `src/runtime/`, keeps `src/domain/` pure. Don't try to make everything immutable — only the parts where purity pays off.

### 3. Time is an input

Your logic can't read the wall clock freely. `Date.now()` is banned from `src/domain/**` because:
- Tests need deterministic replays
- Networked play needs lockstep sync
- Recording/replay features need it

Every tick takes a `deltaMs` parameter. If you need timestamps, inject an `ITimePort`.

### 4. Randomness is an input

Same reason. `Math.random()` is banned from `src/domain/**`. Use `IRandomPort` seeded at game start. That way:
- A test run is reproducible
- Speedrunners can share seeds
- Crash reports can replay the exact sequence

### 5. Coordinates are not CSS

The Phaser coordinate system has `(0,0)` at the top-left, Y increases downward, positions are in pixels (not rem/em/%). Conversions from "world space" (where gameplay happens) to "screen space" (what the camera shows) come up constantly. You'll need to think in two coordinate systems more than you're used to.

### 6. The renderer can lie about your state

You can't debug a visual glitch by reading your state — the sprite might be in the right place visually for the wrong reason (wrong origin, wrong scale, wrong depth, last frame's interpolation). Keep a truth source (`GameState`) and render *from* it; never read game logic *from* a sprite's position.

## The architectural pattern this template enforces

```
┌──────────────────────────────────────────────┐
│  Input (keyboard, gamepad, network, AI bot)  │  ← runtime/
└──────────────┬───────────────────────────────┘
               │ command
               ▼
┌──────────────────────────────────────────────┐
│      Domain: applyMoveIntent, resolveOverlap │  ← src/domain/
│      Pure, deterministic, testable           │
└──────────────┬───────────────────────────────┘
               │ new state + events
               ▼
┌──────────────────────────────────────────────┐
│  Features: orchestrate domain + emit events  │  ← src/features/
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│   Runtime: render sprites, play audio, HUD   │  ← runtime/
└──────────────────────────────────────────────┘
```

Every frame walks that flow. If you ever feel tempted to "just do it in the scene" — stop. The reason the rest of the industry has compiler-enforced layer rules in large games is exactly that pull.

## A mental model that has worked for people coming from backend

Think of each tick as a **single HTTP request** that takes 16ms:
- Request body = the current `GameState` + the player's intent + `deltaMs`
- Handler = your feature orchestration
- Response = the next `GameState` + events for side effects
- Side effects (sprite updates, audio) happen in runtime after the "response" lands

In this mental model, `GameState` is your DB row, features are your controllers, runtime is your view layer, and ports are your DAOs/clients. You already know how to build this shape.

## Things you will Google a lot (and shouldn't be embarrassed about)

- "How to make a sprite move with arrow keys" → cursor keys, `scene.input.keyboard.createCursorKeys()`
- "How to detect collision" → `scene.physics.add.overlap(a, b, handler)` — or the pure-domain version we use here
- "Why does my sprite jitter" → delta time not applied to velocity
- "How to flip a sprite horizontally" → `sprite.setFlipX(true)`
- "How to make a camera follow the player" → `scene.cameras.main.startFollow(sprite)`
- "Why does my tween not play" → you forgot `this.tweens.add(...)` returns a handle; don't `await` it unless it's a promise wrapper

Keep a file of your own Phaser gotchas as you hit them. After a month you'll have your own reference.

## Next

Now that the mental model is in place, [02 — Core Concepts](./02-core-concepts.md) walks through the specific vocabulary of 2D game dev. No mystery jargon past that point.

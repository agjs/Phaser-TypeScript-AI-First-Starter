# 04 — Game Design Primer

You can make a thing move on screen. Now: what makes that thing a *game people want to play*? This doc is game design condensed to what a first-time solo dev actually needs. It skips entire textbooks' worth of nuance because you don't need it yet.

## The only definition of "game" you need right now

> A game is a system where a player makes interesting decisions under constraints, and finds out what happens.

If there are no decisions, it's an animation. If the decisions aren't interesting, it's a chore. If there are no constraints, it's a sandbox. If the player can't find out what happens, it's a puzzle with no feedback.

## The core loop

Every game has a **core loop** the player executes hundreds of times per session. It's the atomic unit of fun.

| Game | Core loop |
|---|---|
| Tetris | piece falls → rotate/place → line clears → score → repeat |
| Slay the Spire | play cards → deal damage → enemy dies → draw cards → repeat |
| Stardew Valley | water crops → chop wood → mine → sleep → day progresses → repeat |
| Vampire Survivors | move → enemies die → gem drops → level up → choose upgrade → repeat |
| Battle City (Tank 1990) | move → shoot → destroy tank → protect base → repeat |

Before you write code, write down your core loop in **six verbs or fewer**. If you can't, your game doesn't have one yet.

**Exercise**: pick a game you love. Write its core loop in six verbs. Do the same for your game idea. Compare.

## The MDA framework (in 90 seconds)

Designer Robin Hunicke's framework. Games flow through three layers:

1. **Mechanics** — what the code literally does. Rules, algorithms, systems. ("If the player's hitbox overlaps a bullet, HP decreases by 10.")
2. **Dynamics** — what happens when those mechanics interact. Emergent behavior. ("Because bullets hurt, players dodge, so levels designed with cover become interesting.")
3. **Aesthetics** — what the player feels. Tension, triumph, boredom, flow.

**Designers work top-down** (pick the feeling, design mechanics that produce it). **Players experience bottom-up** (the mechanics hit them first; the feeling emerges).

Your job as a first-time designer is to pick **one aesthetic** you're going for (tension? silliness? power fantasy? dread?) and make sure every mechanic you add serves it.

## "Verbs" — the most useful design concept for programmers

Great games are **defined by their verbs**: the handful of concrete actions the player can do.

- Mario: *run, jump, stomp*. That's the game.
- Tetris: *move, rotate, drop*. That's the game.
- Celeste: *run, jump, dash, climb*. Four verbs, 100 hours of content.
- Portal: *walk, jump, place blue portal, place orange portal*.

More verbs ≠ better game. A game with three well-tuned verbs beats one with twelve half-baked ones every time. Cut ruthlessly.

**Your job**: list the verbs your player will have at hour one, hour five, and hour ten. If the list is identical, the game gets boring. If it doubles every hour, you're overscoped.

## Game feel ("juice")

Game feel is the difference between "button press → thing moves" and "button press → **THING MOVES**". It's the layer of feedback that tells your brain "yes, that worked."

### The juice checklist

| Effect | Why | How in Phaser |
|---|---|---|
| Screen shake on big hits | signals weight | `cameras.main.shake(100, 0.005)` |
| Hit flash (red tint, 100ms) | confirms damage registered | `sprite.setTint(0xff0000)` + timeout |
| Squash/stretch on jump/land | adds life | tween `scaleX`/`scaleY` briefly |
| Particles on impact | satisfies | `scene.add.particles(...)` |
| Hitstop (freeze 50-100ms on big hits) | amplifies impact | pause tweens, skip updates briefly |
| Sound for every action | pure dopamine | short SFX on jump/shoot/pickup |
| Easing on camera follow | smooths motion | `startFollow(player, true, 0.1, 0.1)` |
| Controller rumble | the platonic ideal of juice | Gamepad API |

**Adding juice takes one weekend and doubles how good your game feels.** Save it for late in development — polishing a bad mechanic is wasted effort. But don't skip it.

Watch: [Jan Willem Nijman's "The art of screenshake"](https://www.youtube.com/watch?v=AJdEqssNZ-U) (10 min). Treat this as required.

## Difficulty curves

Players want **increasing pressure, with occasional relief**.

- Rookie mistake: flat difficulty. Player gets bored or stuck.
- Second mistake: monotonic ramp. Player hits a wall and quits.
- Right way: a staircase — each "step" introduces one new challenge, levels off briefly, then ramps again.

Plot your curve on paper:
- X axis: time (minutes)
- Y axis: difficulty (arbitrary 1–10)
- Your curve: up, flat, up, flat, with occasional dips (safe room, shop, cutscene)

**Pro tip from years of playtests**: when players get stuck, it's almost never because the challenge is too hard. It's because they don't understand *why* they failed. Add visual + audio feedback that makes the failure explainable in one glance.

## The one-minute test

Your game is fun in the first minute, or it isn't a game.

If someone sits down cold and within 60 seconds hasn't:
- Understood the core verb
- Succeeded at it at least once
- Felt one bit of positive feedback

…they will quit. This is brutally true for indie games where you have no marketing to retain them.

**Design the first minute like you design a landing page.** Every second has a job.

## Scope discipline (where most solo devs die)

### The iron law
> Your first game will take 4× as long as you think, and cost half as much attention to marketing as you'll regret.

### The scope cuts that save projects

- **One mechanic deep, not five shallow.** Cut every mechanic you can't fully explore.
- **One art style, not three.** Don't try medieval pixel art *and* sci-fi low-poly *and* cartoon 2D.
- **One level that's great beats five that are OK.** Add content to a proven core; don't build content for an unproven one.
- **Cut multiplayer from v1.** Networked play is a separate game, not a feature.
- **Cut the tutorial until after playtesting.** You'll build it wrong before you see real people play.
- **Cut procedural generation until after a hand-crafted version works.** It's always harder than it looks.

### The 10-hour test
Every month of development, ask: "If I stopped today and shipped what I have, would it be 60 minutes of fun?" If no, your next month should be fun-before-features.

## Genre cheatsheet (what each genre optimizes for)

| Genre | Core tension | What to nail first |
|---|---|---|
| Platformer | jumping feel | physics + responsive controls + death/respawn loop |
| Top-down shooter | movement + shooting rhythm | input responsiveness + enemy death feel + wave pacing |
| Puzzle | aha moments | one clear rule per level + difficulty stair |
| Roguelike | build variety | meaningful runs + run-to-run progression |
| Arena brawler | combat depth | hit detection + feel + AI opponents |
| Twin-stick | kinetic flow | movement-shooting synergy + target richness |
| Bullet hell | pattern reading | telegraphing + hitbox clarity + rhythm |
| Visual novel | writing + pacing | dialogue system + save/rewind + reading comfort |
| Deckbuilder | decision density | card synergies + run escalation |
| Tower defense | economy tuning | placement feedback + wave design |

Pick **one**. Build in it. If you mix genres on game one, you'll end up with an average of mediocre.

## Playtest checklist

When you hand the game to someone for the first time:

- [ ] Don't explain anything. Sit quietly.
- [ ] Watch where they look. (It's not where you think.)
- [ ] Watch where they hesitate. (That's a signal gap.)
- [ ] Time how long until they understand the core verb. (Your target: under 30 seconds.)
- [ ] Ask afterwards: "What were you trying to do on minute 3?" (Their answer reveals the implicit goals you forgot to signal.)
- [ ] Don't argue with feedback. Write it down. Filter tomorrow.

Five playtesters will find 90% of your game's problems. Not a hundred, not a thousand. Five.

## What game designers know that programmers don't

### 1. Feedback matters more than fidelity
A cube that squashes and flashes when hit *feels* better than a photorealistic character with no reaction.

### 2. Systems create stories
Don't script everything. Let mechanics interact and surprise you. Most of a roguelike's replayability comes from unintentional combos.

### 3. Tutorialize through level design, not text
"This pit is too wide to jump without dashing" teaches dash better than a text box saying "press X to dash."

### 4. Constraints are features
Limited ammo is more interesting than unlimited ammo. Time pressure is more interesting than infinite time. Add constraints on purpose.

### 5. The player is smarter than you think
Stop explaining. They'll figure it out. Ambiguity is a tool.

### 6. The player is dumber than you think
Stop hiding. They'll miss the door. Redundant signals (color + shape + sound) > any single signal.

(Both are true simultaneously. Welcome to game design.)

## Your first game's spec (a template)

Fill this in before writing one more line of code. It's half a page. Edit it weekly as you learn.

```
NAME: <your game's working title>

ONE-LINE PITCH: <"It's X meets Y, but set in Z.">

CORE LOOP (≤6 verbs): <verb, verb, verb, verb, verb, verb>

PRIMARY AESTHETIC: <the single feeling you want>

SCOPE: <duration of full playthrough, # of levels, # of mechanics>

WINNING STATE: <what does the player achieve?>
LOSING STATE: <what does failure look like?>

WHAT MAKES IT UNIQUE: <if you can't answer this, fix it>

WHAT I'M CUTTING FROM V1: <list at least 5 things>
```

If you can't answer any of these, you don't have a game yet — you have a concept. That's fine; spend a weekend writing, not coding.

## The hardest skill: knowing when to stop

Projects die from adding, not from cutting. Every week ask: **what can I cut that would make this game better?**

The correct answer is never "nothing."

## Next

You've got the taste. [05 — Solo Dev Workflow](./05-solo-dev-workflow.md) turns it into a production plan — from prototype to published.

# 02 — Core Concepts Primer

Every term you'll hear in a game-dev conversation, explained in one paragraph, with the Phaser equivalent and a pointer to where it lives in this template. Skim it once; refer back as you build.

## Art assets

### Sprite
A 2D image rendered on screen. In Phaser: `Phaser.GameObjects.Sprite` or simpler `Image`/`Rectangle`. Almost everything you see on screen is a sprite. In this template, the green square player in the demo is a `Phaser.GameObjects.Rectangle` (see `src/runtime/phaser/entities/PlayerEntity.ts`).

### Spritesheet
A single image file containing many frames laid out in a grid. Loading one big image and slicing it is much faster than loading 40 small ones.
- **Tools**: TexturePacker (commercial), Aseprite (draw + auto-export), Free Texture Packer (free).
- **Phaser**: `scene.load.spritesheet('hero', 'hero.png', { frameWidth: 32, frameHeight: 32 })`.

### Texture atlas
A spritesheet + a JSON file that names each frame. Atlases support non-uniform frame sizes and reduce VRAM usage.
- **Phaser**: `scene.load.atlas('world', 'world.png', 'world.json')`.

### Tileset
A collection of tiles (small square images) meant to tile a map.
- **Example**: grass, water, stone, wall — each 32×32 px.

### Tilemap
A grid of references into a tileset. "At (col 3, row 7) put tile #12." This template's `domain/grid` is a tilemap as pure data; Phaser has a richer `Phaser.Tilemaps.Tilemap` for when you need layers, collision masks, and object layers.
- **Standard tool**: [Tiled Map Editor](https://www.mapeditor.org/) — exports JSON that Phaser loads directly.

### Sprite animation
A sequence of frames shown in rapid succession.
- **Phaser**: `scene.anims.create({ key: 'walk', frames: scene.anims.generateFrameNames('hero', { prefix: 'walk_', start: 0, end: 7 }), frameRate: 12, repeat: -1 })`.

### Origin / pivot
The reference point on a sprite used for positioning and rotation. Default is the top-left in Phaser's coordinate system for `Image`, but center `(0.5, 0.5)` for `Sprite`. Wrong origin = sprites that rotate around their corner. Set with `sprite.setOrigin(0.5, 0.5)`.

### Depth / z-index
Which sprite draws on top. Higher = on top. `sprite.setDepth(10)`. The HUD in this template sits at `depth: 1000`.

### Layer
A grouping of sprites that renders together. Handy for "everything under the HUD" or "everything behind the foreground." In Phaser, `scene.add.layer()` or organize with `Container`.

## Input

### Polling vs event-driven
- **Polling**: ask "is the key down right now?" each frame. Good for held keys (movement).
- **Event**: subscribe to "when the key goes down," fire once. Good for discrete actions (shoot, save).

This template uses polling for movement (`keyboardInput.port.ts`) and events for save/reset.

### Cursor keys
Arrow keys, wrapped by Phaser: `keyboard.createCursorKeys()` returns `{up, down, left, right, shift, space}`.

### Gamepad
Phaser supports gamepads via the Web Gamepad API: `scene.input.gamepad.on('down', ...)`. For local couch co-op this is essential.

### Pointer
Mouse + touch unified. `scene.input.on('pointerdown', (p) => ...)`.

## Physics

### AABB (axis-aligned bounding box)
A rectangle collision box that doesn't rotate. 90% of 2D games use AABB because it's cheap and "good enough." Our `WallCollisionFeature` does AABB by checking the four corners of the player against the tile grid.

### Broad vs narrow phase
- **Broad phase**: "which pairs of objects might be colliding?" (spatial hash, grid)
- **Narrow phase**: "do these two actually collide?" (AABB, SAT, circle)

For a game with <1000 objects, skip broad phase and just check everything against everything. Optimize later.

### Arcade physics vs Matter
Phaser ships two engines:
- **Arcade**: fast, simple, AABB-only. Use this unless you have a reason not to.
- **Matter**: full 2D rigid body (rotation, joints, impulses). Use for physics-puzzle games.

Configured in `src/app/config/gameConfig.ts`. Default in this template is Arcade with zero gravity.

### Velocity / acceleration
Velocity = speed with direction, in pixels per second. Acceleration = change in velocity per second. To move at 200 px/s for one frame: `position += velocity * deltaMs / 1000`.

### Delta time (dt)
Time since last frame, in milliseconds. Using it correctly makes your game run the same speed on a 60Hz laptop and a 240Hz desktop. Every domain function that moves state forward takes `deltaMs` as input.

### Fixed vs variable timestep
- **Variable**: update runs once per render frame, with whatever `deltaMs` was. Simple. Slightly non-deterministic.
- **Fixed**: update runs at a fixed rate (e.g., 60Hz) regardless of render. Determinism; worth it for networking or physics.

Phaser is variable by default. For netcode, you'd build a fixed-step loop on top.

## Camera

### Viewport vs world
- **World space**: where things really are (`player.x = 1500`).
- **Screen space**: where the pixel lands (`canvasX = worldX - camera.scrollX`).

Phaser handles this automatically; you just position in world space. For UI that shouldn't move with the camera, `setScrollFactor(0)`.

### Follow
`scene.cameras.main.startFollow(player, true, 0.1, 0.1)` — follows with 10% lerp so it doesn't jerk.

### Bounds
`cameras.main.setBounds(0, 0, worldWidth, worldHeight)` — camera won't scroll past the edge of your map.

## Scenes

### Scene = state
A Phaser scene is a self-contained game state: menu, overworld, battle, game-over. Start/stop/pause scenes via `scene.start('World')`, `scene.pause('World')`, `scene.launch('HUD')`.

### Scene transitions
- `scene.start(X)` — stops this one, starts X
- `scene.launch(X)` — runs X in parallel
- `scene.sleep() / wake()` — keep the state but pause updates

The template starts at `BootScene` (preload phase) and transitions to `WorldScene` (gameplay).

### Scene data
Pass data between scenes: `scene.start('Battle', { enemyType: 'brute' })`. Receive in the target scene's `init(data)`.

## Audio

### SFX vs music
- **SFX**: short, fire-and-forget (footsteps, explosions). Load as regular audio, play many instances.
- **Music**: long, loops, one instance at a time. Usually streamed rather than loaded.

### Audio sprite
Same idea as a texture atlas: one audio file with many timestamped clips. Cheaper to load than many small files.

### Phaser audio
`scene.load.audio('jump', 'sfx/jump.mp3')`, then `scene.sound.play('jump')`. Volume, pan, rate all supported.

### Gotcha
Browsers now require a user gesture before audio plays. Phaser handles this, but your first sound won't play until the player clicks something.

## UI / HUD

### HUD = heads-up display
Score, health, ammo, minimap — UI rendered on top of the game that doesn't move with the camera. In this template, `HudFeature` + `hudRenderer.ts`.

### Text
`scene.add.text(x, y, 'Score: 0', { fontFamily: 'monospace', fontSize: '20px' })`.

### Bitmap fonts
For retro looks or performance, use a bitmap font (texture atlas of letters). Tool: [BMFont](https://www.angelcode.com/products/bmfont/) or [Hiero](https://libgdx.com/wiki/tools/hiero).

### Menus
Most indie games use a menu scene with clickable `Text` objects or a tiny state machine. Don't over-engineer — game menus are rarely the interesting part.

## Tweens

### What
A tween animates a property over time: "slide this sprite from x=100 to x=200 over 500ms with an ease-out curve."

### Phaser
```ts
scene.tweens.add({
  targets: sprite,
  x: 200,
  duration: 500,
  ease: 'Cubic.easeOut',
});
```

### Easing
The shape of the motion curve: Linear, Cubic, Bounce, Elastic. Easing is half of what makes games feel good. Try [easings.net](https://easings.net/) to see each one.

### Chains and timelines
`scene.tweens.chain([t1, t2, t3])` to run them in sequence.

## Particles

Small sprites spawned in bursts (explosion, smoke, spark). Phaser has `scene.add.particles(x, y, 'texture', config)`. 30% of "game feel" is particles.

## Save / load

### Serialization
Convert `GameState` to a string (JSON is fine for small games). Version your save format with a `version` field so future you can migrate.

### Where to save
- **Web**: `localStorage` (this template) for small data, `IndexedDB` for bigger.
- **Steam**: Steam Cloud + local files.
- **Native**: filesystem.

### What to save
The *minimum* that reproduces the game state. Not sprite positions — those are computed from state. Think of a save as a seed + domain state.

## Content / data

### Data-driven design
Instead of `if (enemy.type === 'goblin')` everywhere, define enemies as JSON with stats and behaviors. This template's `src/content/` is set up for this; Zod schemas validate at load.

### Why
- AI is better at generating data than code.
- Balance tuning becomes a text-file edit, not a code change.
- Non-programmers (designers, playtesters) can contribute.

## Common game patterns

### State machines
A player has states: idle, walking, jumping, attacking. Transitions between them are explicit. Pattern keeps complex behavior understandable.

### Object pooling
Reuse bullets, particles, enemies instead of creating/destroying (GC pressure, allocation churn). `scene.physics.add.group()` with a `maxSize` and `active` flag.

### Finite state machine scenes
Menu → Play → GameOver → Menu. Each scene handles its own inputs, audio, transitions.

### Observer / event bus
Features emit events; renderer/audio react. Already in the template (`src/shared/events/eventBus.ts`).

### Update order
Bugs hide in update order. In this template: input → movement → collision → interaction → render. Lock it in and document it.

## Performance, very roughly

### Frame budget
60 FPS = 16.67ms per frame. Your update + render combined must fit in that. Anything under 4ms is invisible; 8ms is comfortable; above 12ms you risk stutter on slower machines.

### Cheap things (do freely)
- Math on numbers
- Set position/rotation on an existing sprite
- Emit events, iterate a small array

### Moderate
- Create a sprite (allocating)
- Play a sound
- Tween

### Expensive (care)
- Load an asset mid-game
- Allocate many objects per frame (GC churn)
- Text re-rendering every frame (cache it)

### When it matters
It mostly doesn't. Ship the game first, profile if it's slow.

## Next

You now speak the language. [03 — AI Asset Generation](./03-ai-asset-generation.md) covers the big practical gap: how to actually make the art, the sounds, and the music without being an artist or musician.

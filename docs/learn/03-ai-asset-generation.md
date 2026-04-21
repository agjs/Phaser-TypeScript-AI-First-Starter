# 03 — AI Asset Generation Playbook

The single biggest reason programmers don't ship games is art. In 2026 that excuse is gone. This doc is a working playbook: the tools that exist right now, the prompts that work, the pitfalls that eat a weekend, and how to get the output into Phaser without a detour.

## The jobs you need done

A typical 2D game needs:

| Asset | Examples |
|---|---|
| Character sprites | player, enemies, NPCs |
| Sprite animations | walk cycles, attack frames |
| Tilesets | ground, walls, decorations |
| Props / pickups | coins, power-ups, doors |
| Backgrounds | sky, parallax layers |
| UI | buttons, panels, icons, fonts |
| Sound effects | jumps, hits, pickups, UI clicks |
| Music | menu, gameplay, boss |
| Voice lines | optional, but huge for personality |

You do not need to become an artist or musician to produce any of these. You need to become a **curator** who picks the right tool, writes a tight prompt, iterates to a usable result, and integrates it.

## Core principle: style consistency beats quality

A game with **mediocre art in a consistent style** looks 10× better than a game with mixed-quality, mixed-style assets. When you use AI, consistency is the hardest thing to get — and the thing you must fight for hardest.

Three ways to keep style consistent:

1. **Pick one tool per asset type and stick with it** — don't mix Midjourney and Stable Diffusion and Scenario for the same sprite set.
2. **Use the same style reference across every prompt** — save your working prompt as a template and only change the subject.
3. **Batch generate** — make 20 enemies in one session with the same seed/prompt, not five this weekend and five next month.

## Pixel art & 2D sprites

### Tools, ranked by practical usefulness for solo devs (early 2026)

| Tool | Best at | Paid/Free | Notes |
|---|---|---|---|
| [Scenario.gg](https://www.scenario.gg/) | Game-style 2D assets, trainable on your style | Paid, generous free tier | Purpose-built for game dev. Train a style model on 10–20 reference images and every subsequent generation stays on-brand. |
| [Retro Diffusion](https://www.retrodiffusion.ai/) | Pixel art specifically | Paid, cheap credits | If you want pixel art, this beats general models by a lot. Nails clean palettes and the grid. |
| [PixelLab.ai](https://www.pixellab.ai/) | Pixel art + animation frames | Paid | Does rotation and walk cycles from a single base sprite. |
| Midjourney (via Discord/web) | General 2D art, stylization | Paid | Gorgeous, sometimes inconsistent. Use `--style raw` + explicit style keywords. |
| DALL·E 3 (via ChatGPT) | Concept art, one-offs | Included with ChatGPT | Convenient for brainstorming. Less control than Midjourney. |
| Stable Diffusion (ComfyUI, local) | Full control, LoRAs | Free if you have a GPU | Steep curve. Worth it if you plan to generate hundreds of assets. |
| Leonardo.ai | Game-ready presets | Paid, free tier | Midjourney-lite with more game-specific presets. |
| Flux (Pro/Dev/Schnell) | Photoreal + stylized | Varies | Currently the best open-weight general model; strong prompt adherence. |

### Recommended pipeline for pixel art

1. **Define the style in writing first.** "16-bit SNES JRPG style, 32×32 tiles, limited 16-color palette, black 1px outlines, top-down three-quarter perspective." Put this in a `docs/style.md` or `.specify/memory/art-style.md`. Every prompt begins with this string.
2. **Generate a character turnaround.** Front, back, left, right from the same description. Fix the front view first; get the other directions to match.
3. **Generate the animation frames** (walk cycle: 4-8 frames, run: 6-8, attack: 3-5, idle: 2-4 with small breathing motion) from the locked character design. Tools like PixelLab animate from one base.
4. **Clean up in Aseprite or Piskel.** AI outputs are usually 95% there; a minute of pixel nudging finishes them. [Aseprite](https://www.aseprite.org/) is worth the $20 if you get serious; [Piskel](https://www.piskelapp.com/) is free and browser-based.
5. **Pack into a spritesheet.** [TexturePacker](https://www.codeandweb.com/texturepacker) (commercial, fast) or [Free Texture Packer](https://free-tex-packer.com/app/) (free, web).

### Prompt templates that work

For **top-down character** (Zelda / Link to the Past style):
```
16-bit top-down JRPG sprite, <character description>, 32x32 pixels,
limited 16-color palette, clean 1px black outlines, three-quarter view,
idle pose facing down, transparent background, no shadow
```

For **platformer character** (Celeste / Hollow Knight style):
```
2D platformer side-view sprite, <character description>, 48x48 pixels,
flat colors, clean outlines, idle pose facing right, readable silhouette,
transparent background
```

For **tile** (ground / wall / floor):
```
Seamless tileable 32x32 pixel art texture, <material description>,
top-down view, no outlines at edges, no decorative features at edges
(edges must tile seamlessly with a copy of itself), flat colors
```

For **UI icon** (inventory / ability icons):
```
Pixel art game UI icon, <concept>, 32x32 pixels, square format,
bold silhouette, high contrast, centered on transparent background,
no text
```

Save the template, swap `<placeholder>` per asset, iterate.

## Animation

### The hard truth
AI-generated frame-by-frame animation is still imperfect. The best approach for solo devs in 2026 is usually:

1. **Rig a sprite in Spine or DragonBones** — hand-animate bones (surprisingly fast once you learn it).
2. **Use Rive** — web-first, modern, free tier, pairs well with Phaser via plugins.
3. **Use [PixelLab.ai](https://www.pixellab.ai/)** — generate walk/run/attack cycles from a base sprite.
4. **Use ComfyUI + AnimateDiff** — if you're willing to learn ComfyUI, this gives the most control.
5. **Avoid** trying to Midjourney 8 separate "frame 1 of walk cycle, frame 2, ..." prompts. Style drifts per frame, results look janky.

### Tween-heavy animation (recommended path)
Many indie games avoid frame-by-frame entirely: one sprite, animated with tweens (squash/stretch on jump, rotation on spin, scale on impact). Phaser's tween system is good enough to fake a lot. `damagedSprite.setTint(0xff0000)` for 100ms already reads as "hit."

### Particles
Replace expensive animation with particle bursts. Explosion = 20 particles scaled down over 300ms with color fade. Shooting = a line of sparks. Pickups = confetti. Particles are cheaper to make *and* run than character animations.

## Tilemaps and level design

### Tiled Map Editor
**The industry-standard 2D level editor.** Free, offline, used by thousands of shipped games. Learn it early.

- Download: [mapeditor.org](https://www.mapeditor.org/)
- Workflow: create tileset → paint tiles on layers → export to JSON → load in Phaser
- Phaser integration: `scene.make.tilemap({ key: 'level1' })`

### AI-generated tilesets
Feed an AI a prompt like:
```
Seamless 8x8 grid of 32x32 game tiles, <theme>, including:
grass, dirt path, stone wall, wood plank, water, sand, corner tiles,
edge transitions. All tiles must work together as a coherent set.
Flat colors, 16-color palette, clean pixel art.
```

Results are variable. Expect to pick the best 3–5 tiles, recreate the rest in Aseprite using them as a style anchor.

### Procedural generation
For roguelikes/generated levels, you don't need an art tool at all — you need an algorithm. Start with BSP (binary space partitioning) for dungeons, cellular automata for caves. [Red Blob Games](https://www.redblobgames.com/) is the best resource.

## Sound effects

### Tools, ranked for solo devs

| Tool | Best at | Paid/Free | Notes |
|---|---|---|---|
| [ElevenLabs Sound Effects](https://elevenlabs.io/sound-effects) | Realistic and stylized SFX from text prompts | Paid, free trial | The clear leader in 2026. "An 8-bit coin pickup with a slight echo" — works. |
| [Stable Audio](https://www.stableaudio.com/) | Longer ambient / music-like SFX | Paid, free tier | Better for soundscapes than snappy SFX. |
| [OpenAI Sounds](https://openai.com) | Generated speech + SFX | Paid | Newer, improving fast. Good for voice. |
| [sfxr](https://sfxr.me/) / [jsfxr](https://sfxr.me/) | Retro bleeps (coin, jump, laser) | Free | Not AI at all — parametric generator. Perfect for 8-bit/16-bit games. Use it. |
| [Freesound.org](https://freesound.org/) | Huge CC-licensed library | Free with attribution | Not AI. Still the biggest repository; search first before generating. |
| [Soundly](https://getsoundly.com/) | Pro SFX library + search | Paid | Overkill for solo dev. |

### Practical workflow
1. **Open sfxr / jsfxr first** for any retro-style game. It generates bleeps and bloops in seconds.
2. **For realistic/modern SFX, use ElevenLabs.** Prompt: "A soft wooden click with a metallic edge, short decay, for a UI button press."
3. **Batch per category.** Generate 10 jump sounds in one session, pick 2, mark the favorite, reuse the prompt style.
4. **Normalize volume.** All SFX should peak at roughly the same dB so the player doesn't get blown out by one sound. [Audacity](https://www.audacityteam.org/) (free) has a "Loudness Normalization" effect.
5. **Export as OGG or MP3.** OGG is smaller and better for web; some older browsers preferred MP3. Phaser supports both.

## Music

### Tools

| Tool | Best at | Paid/Free |
|---|---|---|
| [Suno](https://suno.com/) | Full songs with vocals or instrumental, wide genre range | Paid, free tier |
| [Udio](https://www.udio.com/) | High-fidelity full songs, similar to Suno | Paid, free tier |
| [AIVA](https://www.aiva.ai/) | Orchestral / game-music focused | Paid, free tier |
| [MusicGen](https://huggingface.co/spaces/facebook/MusicGen) | Open-weight, local if you have a GPU | Free |
| [Soundraw](https://soundraw.io/) | Royalty-free, genre presets | Paid |

### The legal bit (important)
Check the terms of service of every music tool. Some give you full commercial rights on the paid tier, some don't, some are ambiguous. **Read the ToS.** Suno and Udio currently grant commercial rights on paid plans. AIVA's indie plan is explicit about game/film use. If you're shipping commercially, the $10–20/month for confirmed rights is cheap insurance.

### Practical workflow
1. **Generate 3–5 candidate tracks** per level/mood.
2. **Pick favorites. Export at WAV.**
3. **Loop-point them.** Most AI-generated songs don't loop cleanly. Use [Audacity](https://www.audacityteam.org/) or Reaper to cut a clean loop (find a bar boundary, fade in/out 20ms to hide seams).
4. **Compress to OGG for web.** 128 kbps stereo is fine for most games; streaming bandwidth matters more than audiophile fidelity.

## Voice

### Tools
- **ElevenLabs** — leading voice synthesis as of 2026, huge library of voices, can clone your own with 30 seconds.
- **OpenAI TTS** — cheaper, good quality, limited voices.
- **PlayHT** — competitive, specialized for long-form.

### When it's worth it
- Minor: character barks ("Hyah!", "Take that!") — cheap to add, big personality boost.
- Major: cutscenes / dialogue — can make a solo-dev game feel enormously more produced.

### Ethics
Don't clone real people's voices without consent. Use the provided voice libraries.

## Fonts

- **Free**: [Google Fonts](https://fonts.google.com/), [dafont.com](https://www.dafont.com/) (check license).
- **Retro games**: [1001 Fonts - Pixel](https://www.1001fonts.com/pixel-fonts.html), [Pixeled](https://www.dafont.com/pixeled.font).
- **Bitmap fonts for pixel games**: use a pixel TTF and Phaser renders it crisply at integer scales.
- **Generate your own**: probably not worth it until your style is unique enough to need one.

## Getting assets into Phaser

### Image loading

```ts
// In BootScene.preload()
this.load.image('player', 'assets/player.png');
this.load.spritesheet('hero', 'assets/hero-sheet.png', {
  frameWidth: 32,
  frameHeight: 32,
});
this.load.atlas('ui', 'assets/ui.png', 'assets/ui.json');
this.load.audio('jump', 'assets/sfx/jump.ogg');
this.load.audio('music-menu', ['assets/music/menu.ogg', 'assets/music/menu.mp3']);
```

Put files under `public/assets/` in this template so Vite serves them at `/assets/...`.

### Folder layout convention

```
public/assets/
├── sprites/        # character + prop sprites
├── tilesets/       # tileable tilemaps
├── ui/             # buttons, panels, icons
├── sfx/            # short audio
├── music/          # loop-ready tracks
├── fonts/          # ttf / woff / bitmap
└── LICENSES.md     # attribution for anything CC-licensed
```

Keep `LICENSES.md` up to date as you add assets — it's painful to backfill two months before launch.

### Tile the output
For tilemaps, Phaser expects:
- A **tileset image** (PNG, grid of tiles)
- A **map JSON** (exported from Tiled)

Load:
```ts
this.load.image('tiles', 'assets/tilesets/world.png');
this.load.tilemapTiledJSON('level1', 'assets/maps/level1.json');
```

Create:
```ts
const map = this.make.tilemap({ key: 'level1' });
const tileset = map.addTilesetImage('world', 'tiles');
const ground = map.createLayer('ground', tileset!);
const walls = map.createLayer('walls', tileset!);
walls?.setCollisionByProperty({ collides: true });
```

## Cost budget for a solo dev

Rough monthly cost of a full AI-powered asset pipeline (2026):

| Category | Tool | Typical monthly |
|---|---|---|
| Sprites / art | Scenario or Retro Diffusion | $10–30 |
| Animation | PixelLab (if needed) | $10–20 |
| SFX | ElevenLabs | $5–20 |
| Music | Suno or Udio | $10–30 |
| Voice (optional) | ElevenLabs (often same account as SFX) | included |
| Editor tools | Aseprite (one-time $20), Tiled (free) | ~0 ongoing |
| **Total** | | **$35–100/month** |

A decent solo-dev budget for a 3-month project is **$100–300 in tools**. Less than one asset pack on the Unity store.

## Things that eat weekends (avoid)

- **Chasing perfect style consistency across 500 assets generated over 3 months.** Lock style early, batch generate, resist fiddling.
- **Building your own asset pipeline** before shipping anything. Use TexturePacker/Tiled. Write your own only if they demonstrably fail you.
- **Premature licensing.** Don't buy a $50 commercial-license font for a weekend prototype. Upgrade assets when you decide to ship.
- **Obsessing over quality on prototype assets.** Squares and circles work until the gameplay is fun. Then, and only then, make it pretty.
- **Mixing free and paid AI tools in the same game** — you'll eventually get a DMCA notice because one of them trained on copyrighted pixel art you can't identify. Pick tools with clear commercial terms.

## Attribution checklist for shipping

- [ ] Every asset's source tool / artist listed in `public/assets/LICENSES.md`
- [ ] Every CC-BY asset credited in-game (credits scene) or in README
- [ ] ToS of every AI tool you used permits commercial use
- [ ] You own (or have rights to) every font
- [ ] Every SFX from Freesound has proper attribution
- [ ] Music rights confirmed

## Next

With art, audio, and levels handled, the only thing left is the game itself. [04 — Game Design Primer](./04-game-design-primer.md) covers what actually makes a game good, from someone who's designed them for programmers who haven't.

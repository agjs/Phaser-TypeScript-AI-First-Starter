# Naming Conventions

## File suffixes in `src/domain/<Module>/`

| File                   | Contents                                       |
| ---------------------- | ---------------------------------------------- |
| `Module.types.ts`      | Public types, interfaces                       |
| `Module.model.ts`      | State factories (`create<Module>`)             |
| `Module.constants.ts`  | Named numeric/string constants only            |
| `Module.behavior.ts`   | Pure functions; state transitions              |
| `Module.system.ts`     | Orchestration across behaviors                 |
| `Module.contracts.ts`  | Module-specific port interfaces                |
| `Module.test.ts`       | Co-located unit tests for behaviors            |
| `index.ts`             | Named re-exports only                          |

## Features

| File                     | Contents                                                  |
| ------------------------ | --------------------------------------------------------- |
| `FeatureName.ts`         | `createFeatureNameFeature(deps) → IFeatureNameFeature`   |
| `FeatureName.test.ts`    | Integration test with fake ports                          |
| `FeatureName.contracts.ts` | Renderer/adapter interfaces the feature needs            |

## Scenes

| File                   | Contents                                                    |
| ---------------------- | ----------------------------------------------------------- |
| `<Scene>.ts`           | Thin Phaser class: constructor, preload, create, update    |
| `<Scene>.setup.ts`     | Wires features for the scene; returns `{update, dispose}`  |
| `<Scene>.constants.ts` | Scene key, dimensions                                      |

## Other conventions

- **Interfaces start with `I`**: `ITimePort`, `IMovementFeature`.
- **PascalCase** for types, classes, scenes.
- **camelCase** for functions and variables.
- **SCREAMING_SNAKE_CASE** for constants.
- **kebab-case** for content ids, file names under `definitions/`.
- Always use named exports. The `import/no-default-export` lint rule enforces this.
- `import type` for type-only imports (required by `verbatimModuleSyntax`).

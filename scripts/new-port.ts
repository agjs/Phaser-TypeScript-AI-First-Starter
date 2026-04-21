import { resolve } from 'node:path';
import process from 'node:process';

import { require1Arg, toPascalCase, writeFileSafe } from './_lib.js';

const raw = require1Arg('new:port');
const Name = toPascalCase(raw).replace(/Port$/, '');
const sharedBase = resolve(process.cwd(), 'src', 'shared');

const portInterface = `I${Name}Port`;
const fakeFile = `${sharedBase}/testing/fake${Name}.port.ts`;

const files: Record<string, string> = {
  [fakeFile]: `import type { ${portInterface} } from '../types/ports.js';

export const createFake${Name}Port = (): ${portInterface} => ({
  // TODO: implement fake methods mirroring ${portInterface}
});
`,
};

console.log(`creating port + fake: ${portInterface}`);
console.log(`
Add the interface to src/shared/types/ports.ts:

  export interface ${portInterface} {
    // method signatures here
  }

Then export it from src/shared/types/index.ts.
`);
for (const [path, body] of Object.entries(files)) {
  writeFileSafe(path, body);
}
console.log(`Next: implement a concrete adapter in src/runtime/adapters/.`);

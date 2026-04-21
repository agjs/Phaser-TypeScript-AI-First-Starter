import { resolve } from 'node:path';
import process from 'node:process';

import { require1Arg, toKebabCase, toPascalCase, writeFileSafe } from './_lib.js';

const raw = require1Arg('new:content');
const Name = toPascalCase(raw);
const kebab = toKebabCase(raw);
const upper = Name.toUpperCase();
const contentBase = resolve(process.cwd(), 'src', 'content');

const schemaFile = `${contentBase}/schemas/${kebab}.schema.ts`;
const defsFolder = `${contentBase}/definitions/${kebab}s`;

const files: Record<string, string> = {
  [schemaFile]: `import { z } from 'zod';

export const ${Name}Schema = z.object({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/, '${Name} id must be kebab-case ASCII')
    .min(1),
  displayName: z.string().min(1),
});

export type ${Name} = z.infer<typeof ${Name}Schema>;
`,
  [`${defsFolder}/example-${kebab}.json`]: `{
  "id": "example-${kebab}",
  "displayName": "Example ${Name}"
}
`,
  [`${defsFolder}/index.ts`]: `import { ${Name}Schema, type ${Name} } from '../../schemas/${kebab}.schema.js';

import example${Name}Raw from './example-${kebab}.json' with { type: 'json' };

export const EXAMPLE_${upper}: ${Name} = ${Name}Schema.parse(example${Name}Raw);

export const ALL_${upper}S: readonly ${Name}[] = [EXAMPLE_${upper}];
`,
};

console.log(`creating content type: ${Name}`);
for (const [path, body] of Object.entries(files)) {
  writeFileSafe(path, body);
}
console.log(`\nExport the new schema from src/content/schemas/index.ts.`);

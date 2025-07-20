import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { expect, it } from 'vitest';

const promiseExec = promisify(exec);

it('test', async () => {
  const promise = promiseExec(
    'npx biome check --reporter=json --error-on-warnings --write --config-path="biome.base.jsonc" --stdin-file-path="example.ts"',
    {
      encoding: 'utf-8',
      timeout: 5000,
    },
  );
  promise.child.stdin?.write(
    [
      'import { it, expect } from "vitest";',
      'import { delimiter } from "path";',
      `it("delimiter is ':'", () => {`,
      '    expect(',
      '      delimiter',
      '    ).toEqual(":")',
      '})',
    ].join('\n\r'),
  );
  promise.child.stdin?.end();

  const { stdout } = await promise;
  expect(stdout).toBe(
    [
      "import { delimiter } from 'path';",
      "import { expect, it } from 'vitest';",
      '',
      `it("delimiter is ':'", () => {`,
      "  expect(delimiter).toEqual(':');",
      '});',
      '',
    ].join('\n'),
  );
});

import fs from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (
      (specifier.startsWith('./') || specifier.startsWith('../')) &&
      context.parentURL
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const candidateJs = path.resolve(parentDir, `${specifier}.js`);
      if (fs.existsSync(candidateJs)) {
        return {
          url: pathToFileURL(candidateJs).href,
          shortCircuit: true,
        };
      }
      const candidateIndex = path.resolve(parentDir, specifier, 'index.js');
      if (fs.existsSync(candidateIndex)) {
        return {
          url: pathToFileURL(candidateIndex).href,
          shortCircuit: true,
        };
      }
    }
    throw err;
  }
}

import { fileURLToPath } from 'node:url';

import { getWorkspaceRoot } from './get-root-path.ts';
import { runPrepare } from './prepare.ts';

runPrepare(getWorkspaceRoot(fileURLToPath(new URL('.', import.meta.url))));

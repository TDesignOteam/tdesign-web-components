import { fileURLToPath } from 'node:url';

import { runPrepare } from '../prepare/index.ts';
import { getWorkspaceRoot } from '../shared/workspace.ts';

runPrepare(getWorkspaceRoot(fileURLToPath(new URL('.', import.meta.url))));

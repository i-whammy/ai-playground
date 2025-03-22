
import { Mastra } from '@mastra/core/mastra';
import { createLogger } from '@mastra/core/logger';

import { weatherAgent } from './agents';
import { rakutenRecipe } from './agents/rakutenrecipe';

export const mastra = new Mastra({
  agents: { weatherAgent, rakutenRecipe },
  logger: createLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

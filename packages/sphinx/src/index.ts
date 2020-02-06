import { Plugin } from '@pipedoc/core';
import SphinxPipe from './sphinxPipe';

const plugin: Partial<Plugin> = {
  config: {},
  name: 'spinx',
  pipe: SphinxPipe
};

export default plugin;

import { Plugin } from 'pipedoc';
import SphinxPipe, { SphinxPipeConfig } from './sphinxPipe';

const plugin: Partial<Plugin<SphinxPipeConfig>> = {
  config: {},
  name: 'sphinx',
  pipe: SphinxPipe
};

export default plugin;

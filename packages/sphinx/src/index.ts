import { Plugin } from 'pipedoc';
import SphinxPipe from './sphinxPipe';

const plugin: Partial<Plugin> = {
  config: {},
  name: 'sphinx',
  pipe: SphinxPipe
};

export default plugin;

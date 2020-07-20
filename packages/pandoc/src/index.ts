import { Plugin } from 'pipedoc';
import PandocPipe, { PandocPipeConfig } from './pandocPipe';

const plugin: Partial<Plugin<PandocPipeConfig>> = {
  config: { to: 'md' },
  name: 'pandoc',
  pipe: PandocPipe
};

export default plugin;

import { Plugin } from 'pipedoc';
import PandocPipe from './pandocPipe';

const plugin: Partial<Plugin> = {
  config: {},
  name: 'pandoc',
  pipe: PandocPipe
};

export default plugin;

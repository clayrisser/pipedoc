import { Plugin } from 'pipedoc';
import ExamplePipe, { ExamplePipeConfig } from './examplePipe';

const plugin: Partial<Plugin<ExamplePipeConfig>> = {
  config: {},
  name: 'example',
  pipe: ExamplePipe
};

export default plugin;

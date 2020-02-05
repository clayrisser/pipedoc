import { Command, flags } from '@oclif/command';
import PipeDoc from '..';
import defaultOptions from '../defaultOptions';

export default class Build extends Command {
  static description = 'build docs';

  static examples = ['$ pipedoc build'];

  static strict = false;

  static flags: flags.Input<any> = {
    config: flags.string({ char: 'c', required: false }),
    debug: flags.boolean({ char: 'd', required: false })
  };

  async run() {
    const { flags } = this.parse(Build);
    const pipeDoc = new PipeDoc({
      ...defaultOptions,
      ...JSON.parse(flags.config || '{}'),
      debug: !!flags.debug
    });
    return pipeDoc.build();
  }
}

import Doc from './doc';

export interface PipeConfig {}

export default class Pipe {
  constructor(public config: PipeConfig) {}

  async pipe(doc: Doc): Promise<Doc> {
    return doc;
  }
}

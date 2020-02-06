export default class Doc {
  constructor(
    public rootPath: string,
    public type: string,
    public glob = '**/*'
  ) {}
}

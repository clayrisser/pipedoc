declare module 'highwayhash' {
  namespace HighwayHash {
    function asString(key: Buffer, input: Buffer): string;

    function asHexString(key: Buffer, input: Buffer): string;

    function asUInt32Low(key: Buffer, input: Buffer): number;

    function asUInt32High(key: Buffer, input: Buffer): number;
  }

  export default HighwayHash;
}

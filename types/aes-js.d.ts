declare module 'aes-js' {
  export class ModeOfOperation {
    static ecb: new (key: Uint8Array) => {
      encrypt(data: Uint8Array): Uint8Array;
      decrypt(data: Uint8Array): Uint8Array;
    };
  }

  export namespace ModeOfOperation {
    class ecb {
      constructor(key: Uint8Array);
      encrypt(data: Uint8Array): Uint8Array;
      decrypt(data: Uint8Array): Uint8Array;
    }
  }
}


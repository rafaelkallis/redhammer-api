/// <reference types="node" />

declare module "node-jose" {
  namespace JWE {
    function createEncrypt(
      options: {
        format?: "compact" | "flattened";
        zip?: boolean;
        fields?: object;
      },
      key: JWK.IKey
    ): IEncryptor;

    interface IEncryptor {
      update(input: Buffer): this;
      final(): Promise<string>;
    }

    function createDecrypt(key: JWK.IKey): IDecryptor;

    interface IDecryptor {
      decrypt(input: string): Promise<{ payload: Buffer }>;
    }
  }

  namespace JWK {
    function asKey(
      key: IRawKey,
      form?:
        | "json"
        | "private"
        | "pkcs8"
        | "public"
        | "spki"
        | "pkix"
        | "x509"
        | "pem"
    ): Promise<IKey>;

    type KeyUse = "sig" | "enc" | "desc";

    interface IJWEEncryptor {
      update(input: Buffer): this;
      final(): Promise<string>;
    }

    interface IRawKey {
      kty: string;
      k: string;
      use?: KeyUse;
      alg?: string;
    }

    interface IKey {
      length: number;
      kty: string;
      kid: string;
      use: KeyUse;
      alg: string;
    }
  }

  namespace JWS {
    function createSign(
      options: {
        format?: "compact" | "flattened";
        alg?: string;
        compact?: boolean;
        fields?: object;
      },
      key: JWK.IKey | JWK.IKey[]
    ): ISigner;

    interface ISigner {
      update(input: Buffer | string, encoding?: string): this;
      final(): Promise<string>;
    }

    function createVerify(
      input: JWK.IKey,
      opts?: {
        allowEmbeddedKey?: boolean;
        algorithms?: string[];
        handlers?: any;
      }
    ): IVerifier;

    interface IVerifier {
      verify(
        input: string,
        opts?: { allowEmbeddedKey?: boolean }
      ): Promise<{ payload: Buffer }>;
    }
  }
}

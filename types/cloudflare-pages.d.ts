type KVNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ keys: Array<{ name: string }> }>;
};

type R2Object = {
  body: ReadableStream;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
};

type R2Bucket = {
  get(key: string): Promise<R2Object | null>;
  put(
    key: string,
    value: ReadableStream,
    options?: { httpMetadata?: { contentType?: string } }
  ): Promise<void>;
};

type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
  // Present on every Pages Function; middleware uses it to invoke the next
  // handler (or the static asset) in the chain.
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
}) => Response | Promise<Response>;

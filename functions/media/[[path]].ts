import { Env } from "../_shared";

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const rawPath = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  if (!rawPath || rawPath.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  const object = await env.FAMILY_MEDIA.get(rawPath);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  return new Response(object.body, { headers });
};

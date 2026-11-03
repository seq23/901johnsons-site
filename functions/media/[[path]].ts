import { Env, PENDING_MEDIA_PREFIX } from "../_shared";

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const rawPath = Array.isArray(params.path) ? params.path.join("/") : String(params.path || "");
  // Uploads awaiting review are never served publicly; /admin previews them through the token-gated API.
  if (!rawPath || rawPath.includes("..") || rawPath.startsWith(PENDING_MEDIA_PREFIX)) {
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

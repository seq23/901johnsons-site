/**
 * Keep the *.pages.dev preview host out of search indexes.
 *
 * Cloudflare Pages serves this project on both 901johnsons.com and
 * 901johnsons-site.pages.dev. The preview host is otherwise fully indexable
 * and can be ranked as the primary, competing with the production domain.
 * The per-page self-canonical in app/layout.tsx is the main defense; this
 * header is the belt-and-braces one.
 *
 * The noindex is applied ONLY when the request hostname ends in .pages.dev.
 * It must never be emitted on 901johnsons.com.
 */
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next();
  const hostname = new URL(context.request.url).hostname;

  if (!hostname.endsWith(".pages.dev")) {
    return response;
  }

  const tagged = new Response(response.body, response);
  tagged.headers.set("X-Robots-Tag", "noindex, nofollow");
  return tagged;
};

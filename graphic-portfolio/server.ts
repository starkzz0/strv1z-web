// Serve this portfolio:  bun server.ts   →  http://localhost:3000
const dir = import.meta.dir;

Bun.serve({
  port: 3000,
  async fetch(req) {
    let p = new URL(req.url).pathname.split("?")[0];
    if (p.endsWith("/")) p += "index.html";
    const file = Bun.file(dir + decodeURIComponent(p).replace(/\.\./g, ""));
    if (await file.exists()) {
      // HTML is never cached (markup + asset pins change often);
      // versioned css/js (?v=) stay cacheable by URL.
      const noStore = /\.(html|json)$/i.test(p) || !/\.[a-z0-9]+$/i.test(p);
      return new Response(file, noStore ? { headers: { "Cache-Control": "no-store" } } : undefined);
    }
    return new Response("Not found", { status: 404 });
  },
});

console.log("strv1z portfolio → http://localhost:3000");

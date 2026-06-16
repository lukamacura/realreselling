import { NextResponse } from "next/server";

// TEMPORARY: site maintenance mode. Delete this file to restore the site.
const html = `<!DOCTYPE html>
<html lang="sr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Sajt je privremeno nedostupan</title>
<style>
  html,body{height:100%;margin:0}
  body{display:flex;align-items:center;justify-content:center;
    font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
    background:#0a0a0a;color:#fafafa;text-align:center;padding:24px}
  h1{font-size:clamp(1.4rem,4vw,2.2rem);font-weight:700;margin:0}
  p{opacity:.6;margin-top:12px}
</style>
</head>
<body>
  <main>
    <h1>Sajt je privremeno nedostupan</h1>
    <p>2023-2026</p>
  </main>
</body>
</html>`;

export function middleware() {
  return new NextResponse(html, {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "Retry-After": "3600",
    },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

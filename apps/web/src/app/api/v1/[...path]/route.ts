import { NextRequest, NextResponse } from 'next/server';

function apiRoot() {
  return (process.env.API_URL ?? 'http://localhost:3001').trim().replace(/\/$/, '');
}

async function proxy(req: NextRequest, pathSegments: string[]) {
  const path = pathSegments.join('/');
  const target = `${apiRoot()}/api/v1/${path}${req.nextUrl.search}`;

  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  const authorization = req.headers.get('authorization');
  if (contentType) headers.set('content-type', contentType);
  if (authorization) headers.set('authorization', authorization);

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: 'no-store',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text();
  }

  const res = await fetch(target, init);
  const outHeaders = new Headers();
  res.headers.forEach((value, key) => {
    if (key === 'transfer-encoding') return;
    outHeaders.set(key, value);
  });

  return new NextResponse(res.body, { status: res.status, headers: outHeaders });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  return proxy(req, (await ctx.params).path);
}

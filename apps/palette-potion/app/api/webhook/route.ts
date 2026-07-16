export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  return Response.json({ ok: true, receivedAt: new Date().toISOString(), body });
}

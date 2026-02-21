import { NextResponse } from "next/server";
import { SearchAlertService } from "@app-inmobiliaria/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await SearchAlertService.unsubscribe(id);
    return new NextResponse(
      `<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><h1>✓ Alerta cancelada</h1><p>No recibirás más notificaciones de esta búsqueda.</p></div></body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  } catch {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><div style="text-align:center"><h1>Error</h1><p>No se pudo cancelar la alerta.</p></div></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

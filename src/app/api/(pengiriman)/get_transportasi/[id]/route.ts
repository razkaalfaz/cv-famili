import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const date = headersList.get("date");

  const transportasi = await db.transportasi.findFirst({
    where: {
      ID_TRANSPORTASI: params.id,
    },
    include: {
      permintaan: true,
    },
  });

  if (transportasi) {
    return NextResponse.json(
      { ok: true, result: transportasi },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  } else {
    return NextResponse.json(
      { ok: false, result: null },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  }
}

export { handler as GET };

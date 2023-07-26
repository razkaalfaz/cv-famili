import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const date = headersList.get("date");

  const armada = await db.armada.findFirst({
    where: {
      ID_ARMADA: params.id,
    },
    include: {
      transportasi: true,
    },
  });

  if (armada) {
    return NextResponse.json(
      { ok: true, result: armada },
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

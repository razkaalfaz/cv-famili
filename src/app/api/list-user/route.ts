import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const users = await db.user.findMany({
    include: {
      permintaan: true,
    },
  });
  const headersList = headers();
  const date = headersList.get("date");

  if (users) {
    return NextResponse.json(
      { ok: true, result: users },
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

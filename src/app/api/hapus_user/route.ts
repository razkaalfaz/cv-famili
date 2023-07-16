import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_USER: number;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const deletedUser = await db.user.delete({
    where: {
      ID_USER: body.ID_USER,
    },
  });

  if (deletedUser) {
    return NextResponse.json({
      ok: true,
      message: `User ${deletedUser.NAME} berhasil dihapus.`,
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika menghapus data user...",
    });
  }
}

export { handler as DELETE };

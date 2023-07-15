import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  NAME: string;
  USERNAME: string;
  PASSWORD: string;
  ROLE: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const newUser = await db.user.create({
    data: {
      NAME: body.NAME,
      USERNAME: body.USERNAME,
      PASSWORD: body.PASSWORD,
      ROLE: body.ROLE,
    },
  });

  if (newUser) {
    return NextResponse.json({
      ok: true,
      message: "Berhasil menambahkan user.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan ketika menambahkan user...",
    });
  }
}

export { handler as POST };

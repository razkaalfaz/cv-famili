import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  username: string;
  password: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const user = await db.user.findFirst({
    where: {
      USERNAME: body.username,
    },
  });

  console.log(user);
  console.log(body.password);

  if (user && user.PASSWORD === body.password) {
    const { PASSWORD, ...result } = user;
    return new NextResponse(JSON.stringify(result));
  } else {
    return new NextResponse(JSON.stringify(null));
  }
}

export { handler as POST };

import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const totalCredit = await prisma.client.aggregate({
      _sum: {
        gredit: true,
      },
    });

    return NextResponse.json(totalCredit._sum.gredit, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch total credit" },
      { status: 500 }
    );
  }
}

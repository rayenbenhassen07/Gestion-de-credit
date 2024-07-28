import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const totalCredit = await prisma.client.aggregate({
      _sum: {
        gredit: true,
      },
      where: {
        date: {
          lt: twoMonthsAgo,
        },
      },
    });

    return NextResponse.json(totalCredit._sum.gredit || 0, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch total credit for clients older than two months",
      },
      { status: 500 }
    );
  }
}

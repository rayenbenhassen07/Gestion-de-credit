import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const clients = await prisma.client.findMany({
      where: {
        date: {
          lt: twoMonthsAgo,
        },
      },
      orderBy: {
        gredit: "desc", // Ordering by gredit if required
      },
    });

    const totalCredit = clients.reduce(
      (acc, client) => acc + (client.gredit || 0),
      0
    );

    return NextResponse.json({ clients, totalCredit }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch clients older than two months", error);
    return NextResponse.json(
      { error: "Failed to fetch clients older than two months" },
      { status: 500 }
    );
  }
}

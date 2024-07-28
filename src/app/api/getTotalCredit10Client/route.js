import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const topClients = await prisma.client.findMany({
      orderBy: {
        gredit: "desc",
      },
      take: 10,
    });

    const totalCredit = topClients.reduce(
      (acc, client) => acc + client.gredit,
      0
    );

    return NextResponse.json({ totalCredit }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch top credit clients" },
      { status: 500 }
    );
  }
}

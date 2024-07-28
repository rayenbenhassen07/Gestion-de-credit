import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req, { params }) {
  try {
    const { clientId } = params;

    // Fetch transactions for the specific clientId
    const transactions = await prisma.transaction.findMany({
      where: { clientId: parseInt(clientId) },
      orderBy: { date: "desc" }, // Optional: Order transactions by date, most recent first
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

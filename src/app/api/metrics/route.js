import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    // Fetch total credit
    const totalCreditPromise = prisma.client.aggregate({
      _sum: {
        gredit: true,
      },
    });

    // Fetch total credit older than two months
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const totalCreditOlderThanTwoMonthsPromise = prisma.client.aggregate({
      _sum: {
        gredit: true,
      },
      where: {
        date: {
          lt: twoMonthsAgo,
        },
      },
    });

    // Fetch top 10 credit clients
    const topClientsPromise = prisma.client.findMany({
      orderBy: {
        gredit: "desc",
      },
      take: 10,
    });

    const [totalCredit, totalCreditOlderThanTwoMonths, topClients] =
      await Promise.all([
        totalCreditPromise,
        totalCreditOlderThanTwoMonthsPromise,
        topClientsPromise,
      ]);

    const topCreditClientsTotal = topClients.reduce(
      (acc, client) => acc + client.gredit,
      0
    );

    return NextResponse.json(
      {
        totalCredit: totalCredit._sum.gredit || 0,
        totalCreditOlderThanTwoMonths:
          totalCreditOlderThanTwoMonths._sum.gredit || 0,
        topCreditClientsTotal,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}

// pages/api/getTopClients.js
import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    // Fetch top clients ordered by gredit in descending order, limit to top 10
    const topClients = await prisma.client.findMany({
      orderBy: {
        gredit: "desc",
      },
      take: 10,
    });

    // Calculate the total gredit of the top clients
    const totalCredit = topClients.reduce(
      (acc, client) => acc + (client.gredit || 0),
      0
    );

    // Return the top clients and the total gredit as JSON
    return NextResponse.json({ topClients, totalCredit }, { status: 200 });
  } catch (error) {
    // Handle any errors that occur during the fetch
    console.error("Failed to fetch top credit clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch top credit clients" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req, { params }) {
  const { oldClientId } = params;

  try {
    const client = await prisma.oldClientInfo.findUnique({
      // Prisma models are generally camelCase
      where: { id: parseInt(oldClientId, 10) }, // Ensure base 10 for integer conversion
    });

    if (client) {
      return NextResponse.json(client, { status: 200 });
    } else {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching client:", error); // Add logging for debugging
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

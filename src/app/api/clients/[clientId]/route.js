import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function DELETE(req, { params }) {
  const { clientId } = params;

  try {
    // Delete all transactions related to the client
    await prisma.transaction.deleteMany({
      where: { clientId: parseInt(clientId) },
    });

    // Delete the client
    await prisma.client.delete({
      where: { id: parseInt(clientId) },
    });

    return NextResponse.json(
      { message: "Client and related transactions deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete client and related transactions" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { clientId } = params;

  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(clientId) },
    });

    if (client) {
      return NextResponse.json(client, { status: 200 });
    } else {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

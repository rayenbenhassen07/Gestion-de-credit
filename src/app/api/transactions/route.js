import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req) {
  try {
    const { type, montant, designation, date, clientId } = await req.json();

    // Find the client
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Determine the new credit balance
    let newGredit = client.gredit;
    if (type === "achat") {
      newGredit += montant;
    } else {
      newGredit -= montant;
    }

    // Create the transaction
    const newTransaction = await prisma.transaction.create({
      data: {
        type,
        montant: parseFloat(montant), // Ensure the montant is stored as a float
        designation,
        date: date ? new Date(date) : undefined, // Ensure the date is in Date format
        clientId,
        currentSoldeCredit: client.gredit, // Store the old credit balance
      },
    });

    // Update the client's gredit, date, and designation
    await prisma.client.update({
      where: { id: clientId },
      data: {
        gredit: newGredit,
        date: date ? new Date(date) : undefined, // Update the client's date to match the transaction's date
        designation, // Update the client's designation
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

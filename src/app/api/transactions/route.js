import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(req) {
  try {
    const { type, montant, designation, date, clientId } = await req.json();

    const data = {
      type,
      montant: parseFloat(montant), // Ensure the montant is stored as a float
      designation,
      clientId,
    };

    if (date) {
      data.date = new Date(date); // Ensure the date is in Date format
    }

    // Create the transaction
    const newTransaction = await prisma.transaction.create({
      data,
    });

    // Find the client
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });

    let newGredit = client.gredit;
    if (type === "achat") {
      newGredit += montant;
    } else {
      newGredit -= montant;
    }

    // Update the client's gredit, date, designation, and type fields
    await prisma.client.update({
      where: { id: clientId },
      data: {
        gredit: newGredit,
        date: data.date, // Update the client's date to match the transaction's date
        designation: data.designation, // Update the client's designation
      },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
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

import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// POST request handler to create a new client and add a transaction of type "achat"
export async function POST(req) {
  try {
    const { name, num, credit, designation } = await req.json();

    const newClient = await prisma.client.create({
      data: {
        name,
        num,
        gredit: parseFloat(credit), // Ensure the credit is stored as a float

        designation,
        transactions: {
          create: {
            type: "achat",
            montant: parseFloat(credit), // You can adjust this if you have a specific montant
            designation: designation,
          },
        },
      },
      include: {
        transactions: true, // Include the transaction in the response
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Failed to create client and transaction:", error);
    return NextResponse.json(
      { error: "Failed to create client and transaction" },
      { status: 500 }
    );
  }
}

// GET request handler to fetch clients with pagination
export async function GET(req) {
  try {
    const clients = await prisma.client.findMany({
      include: {
        transactions: true, // Include transactions in the response
      },
    });

    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

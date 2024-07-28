import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"; // Assuming you have a Table component

export function ModalTransactions({ isOpen, onClose, id }) {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchTransactions = async () => {
        try {
          const res = await fetch(`/api/transactions/${id}`);
          if (res.ok) {
            const data = await res.json();
            setTransactions(data);
          } else {
            const result = await res.json();
            setError(result.error || "Failed to fetch transactions");
          }
        } catch (error) {
          setError("Failed to fetch transactions");
          console.error("Failed to fetch transactions", error);
        }
      };

      fetchTransactions();
    }
  }, [isOpen, id]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Historique</h2>
        {error && <div className="text-red-500 mb-4">Error: {error}</div>}
        <div className="mt-6 overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <Table className="w-full bg-white rounded-md shadow-md">
              <TableHeader className="bg-blue-100">
                <TableRow>
                  <TableHead className="p-4">Type</TableHead>
                  <TableHead className="p-4">Montant</TableHead>
                  <TableHead className="p-4">Désignation</TableHead>
                  <TableHead className="p-4">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className={
                        transaction.type === "achat"
                          ? "bg-red-50"
                          : "bg-green-50"
                      }
                    >
                      <TableCell className="p-4">{transaction.type}</TableCell>
                      <TableCell className="p-4">
                        {transaction.type === "achat" ? "" : "-"}
                        {transaction.montant} TND
                      </TableCell>
                      <TableCell className="p-4">
                        {transaction.designation}
                      </TableCell>
                      <TableCell className="p-4">
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="4" className="p-4 text-center">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <Button onClick={onClose} className="mt-4 bg-red-500 text-white">
          Close
        </Button>
      </div>
    </div>
  );
}

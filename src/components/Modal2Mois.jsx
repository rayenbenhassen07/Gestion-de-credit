"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { ModalTransactions } from "./ModalTransactions"; // Ensure the correct import path

export function Modal2Mois({ isOpen, onClose, id }) {
  const [clients, setClients] = useState([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [error, setError] = useState(null);
  const [isModalTransactionsOpen, setIsModalTransactionsOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const fetchClients = async () => {
        try {
          const res = await fetch(`/api/getClientsOlderThanTwoMonths`);
          if (res.ok) {
            const data = await res.json();
            setClients(data.clients);
            setTotalCredit(data.totalCredit);
          } else {
            const result = await res.json();
            setError(
              result.error ||
                "Échec de la récupération des clients de plus de deux mois"
            );
          }
        } catch (error) {
          setError("Échec de la récupération des clients de plus de deux mois");
          console.error("Failed to fetch clients", error);
        }
      };

      fetchClients();
    }
  }, [isOpen, id]);

  if (!isOpen) return null;

  const handleEditClient = (clientId) => {
    router.push(`/clients/${clientId}`);
  };

  const handleDeleteClient = async (clientId) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== clientId)
        );
      } else {
        const data = await res.json();
        setError(data.error || "Échec de la suppression du client");
      }
    } catch (error) {
      setError("Échec de la suppression du client");
      console.error("Failed to delete client", error);
    }
  };

  const handleOpenTransactionsModal = (clientId) => {
    setSelectedClientId(clientId);
    setIsModalTransactionsOpen(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Clients de Plus de Deux Mois</h2>
        {error && <div className="text-red-500 mb-4">Erreur: {error}</div>}
        <div className="mt-6 overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <Table className="w-full bg-white rounded-md shadow-md">
              <TableHeader className="bg-blue-100">
                <TableRow>
                  <TableHead className="p-4">Nom</TableHead>
                  <TableHead className="p-4">Numéro</TableHead>
                  <TableHead className="p-4">Crédit</TableHead>
                  <TableHead className="p-4">Date</TableHead>
                  <TableHead className="p-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="p-4">{client.name}</TableCell>
                      <TableCell className="p-4">{client.num}</TableCell>
                      <TableCell className="p-4">{client.gredit}</TableCell>
                      <TableCell className="p-4">
                        {new Date(client.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="p-4 flex space-x-2">
                        <Button
                          onClick={() => handleOpenTransactionsModal(client.id)}
                          variant="ghost"
                          size="icon"
                        >
                          <RefreshCwIcon className="w-4 h-4 text-gray-500" />
                        </Button>
                        <Button
                          onClick={() => handleEditClient(client.id)}
                          variant="ghost"
                          size="icon"
                        >
                          <FilePenIcon className="w-4 h-4 text-gray-500" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClient(client.id)}
                        >
                          <TrashIcon className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5" className="p-4 text-center">
                      Aucun client trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-lg">Crédit total : {totalCredit} TND</p>
        </div>
        <Button onClick={onClose} className="mt-4 bg-red-500 text-white">
          Fermer
        </Button>
      </div>

      <ModalTransactions
        isOpen={isModalTransactionsOpen}
        onClose={() => setIsModalTransactionsOpen(false)}
        id={selectedClientId}
      />
    </div>
  );
}

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="blue"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function RefreshCwIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

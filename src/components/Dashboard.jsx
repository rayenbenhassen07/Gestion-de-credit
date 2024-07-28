"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";
import { ModalTransactions } from "./ModalTransactions";
import { ModalTop10client } from "./ModalTop10client";
import { Modal2Mois } from "./Modal2Mois";
import { signOut } from "next-auth/react";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal"; // Import the confirmation modal

export function Dashboard() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [isModalTransactionsOpen, setIsModalTransactionsOpen] = useState(false);
  const [isModalTop10client, setIsModalTop10client] = useState(false);
  const [isModal2Mois, setModal2Mois] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalCreditOlderThanTwoMonths, setTotalCreditOlderThanTwoMonths] =
    useState(0);
  const [topCreditClientsTotal, setTopCreditClientsTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchClients = async (page) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/clients?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setClients((prevClients) => {
            const clientMap = new Map(
              prevClients.map((client) => [client.id, client])
            );
            data.forEach((client) => clientMap.set(client.id, client));
            return Array.from(clientMap.values());
          });
        }
      } else {
        const data = await res.json();
        setError(data.error || "Failed to fetch clients");
      }
    } catch (error) {
      setError("Failed to fetch clients");
      console.error("Failed to fetch clients", error);
    }
    setIsLoading(false);
  };

  const fetchMetrics = async () => {
    try {
      const resTotalCredit = await fetch("/api/getTotalCredit");
      if (resTotalCredit.ok) {
        const totalCredit = await resTotalCredit.json();
        setTotalCredit(totalCredit);
      } else {
        const data = await resTotalCredit.json();
        setError(data.error || "Failed to fetch total credit");
      }

      const resTotalCreditOlderThanTwoMonths = await fetch(
        "/api/getTotalCredit2Moins"
      );
      if (resTotalCreditOlderThanTwoMonths.ok) {
        const totalCreditOlderThanTwoMonths =
          await resTotalCreditOlderThanTwoMonths.json();
        setTotalCreditOlderThanTwoMonths(totalCreditOlderThanTwoMonths);
      } else {
        const data = await resTotalCreditOlderThanTwoMonths.json();
        setError(
          data.error || "Failed to fetch total credit older than two months"
        );
      }

      const resTopCreditClients = await fetch("/api/getTotalCredit10Client");
      if (resTopCreditClients.ok) {
        const { totalCredit } = await resTopCreditClients.json();
        setTopCreditClientsTotal(totalCredit);
      } else {
        const data = await resTopCreditClients.json();
        setError(data.error || "Failed to fetch top credit clients");
      }
    } catch (error) {
      setError("Failed to fetch metrics");
      console.error("Failed to fetch metrics", error);
    }
  };

  useEffect(() => {
    fetchClients(page);
  }, [page]);

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        isLoading ||
        !hasMore
      )
        return;
      setPage((prevPage) => prevPage + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasMore]);

  const handleDeleteClient = async () => {
    try {
      const res = await fetch(`/api/clients/${selectedClientId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== selectedClientId)
        );
        // Refresh metrics
        await fetchMetrics();
        setIsConfirmationModalOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete client");
      }
    } catch (error) {
      setError("Failed to delete client");
      console.error("Failed to delete client", error);
    }
  };

  const handleOpenModal = (clientId) => {
    setSelectedClientId(clientId);
    setIsModalTransactionsOpen(true);
  };

  const handleOpenConfirmationModal = (clientId) => {
    setSelectedClientId(clientId);
    setIsConfirmationModalOpen(true);
  };

  const filteredClients = clients.filter((client) => {
    const lowerCaseSearch = search.toLowerCase();
    return (
      client.name.toLowerCase().includes(lowerCaseSearch) ||
      client.num.toLowerCase().includes(lowerCaseSearch) ||
      client.designation.toLowerCase().includes(lowerCaseSearch)
    );
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex items-center justify-between p-4 bg-blue-100">
          <div className="flex items-center">
            <RefreshCwIcon className="w-6 h-6 text-blue-800" />
            <div className="ml-4">
              <div className="text-2xl font-bold">{totalCredit} TND</div>
              <div className="text-sm text-gray-600">Récap Total Crédit</div>
            </div>
          </div>
        </Card>
        <Card
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
          onClick={() => {
            setModal2Mois(true);
          }}
        >
          <div className="flex items-center">
            <ClockIcon className="w-6 h-6 text-blue-500" />
            <div className="ml-4">
              <div className="text-2xl font-bold">
                {totalCreditOlderThanTwoMonths} TND
              </div>
              <div className="text-sm text-gray-600">
                Crédit total des clients ayant une date supérieure à 2 mois
              </div>
            </div>
          </div>
        </Card>
        <Card
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
          onClick={() => {
            setIsModalTop10client(true);
          }}
        >
          <div className="flex items-center">
            <ArrowUpIcon className="w-6 h-6 text-blue-500" />
            <div className="ml-4">
              <div className="text-2xl font-bold">
                {topCreditClientsTotal} TND
              </div>
              <div className="text-sm text-gray-600">
                Les clients les plus crédités (top 10)
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <Input
            type="search"
            placeholder="Recherche par lettre ou numéro"
            className="w-full p-2 border rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            onClick={() => {
              router.push("ajouter-client");
            }}
            className="ml-4 bg-orange-500 text-white"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Ajouter Client
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <Table className="w-full bg-white rounded-md shadow-md">
          <TableHeader className="bg-blue-100">
            <TableRow>
              <TableHead className="p-4">Nom</TableHead>
              <TableHead className="p-4 hidden lg:table-cell">
                Numéro Téléphone
              </TableHead>
              <TableHead className="p-4">Total Crédit</TableHead>
              <TableHead className="p-4 hidden lg:table-cell">
                Désignation
              </TableHead>
              <TableHead className="p-4 hidden lg:table-cell">
                Date Dernière Crédit
              </TableHead>
              <TableHead className="p-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients
              .sort((a, b) => b.id - a.id)
              .map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="p-4">{client.name}</TableCell>
                  <TableCell className="p-4 hidden lg:table-cell">
                    {client.num}
                  </TableCell>
                  <TableCell className="p-4">{client.gredit}</TableCell>
                  <TableCell className="p-4 hidden lg:table-cell">
                    {client.designation}
                  </TableCell>
                  <TableCell className="p-4 hidden lg:table-cell">
                    {new Date(client.date).toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell className="p-4 flex lg:space-x-2">
                    <Button
                      onClick={() => handleOpenModal(client.id)}
                      variant="ghost"
                      size="icon"
                    >
                      <RefreshCwIcon className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      onClick={() => {
                        router.push(`/clients/${client.id}`);
                      }}
                      variant="ghost"
                      size="icon"
                    >
                      <FilePenIcon className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenConfirmationModal(client.id)}
                    >
                      <TrashIcon className="w-4 h-4 text-gray-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isLoading && <div>Loading...</div>}
        {!hasMore && <div>No more clients</div>}
        {error && <div>{error}</div>}
      </div>

      <ModalTransactions
        isOpen={isModalTransactionsOpen}
        onClose={() => setIsModalTransactionsOpen(false)}
        id={selectedClientId}
      />

      <ModalTop10client
        isOpen={isModalTop10client}
        onClose={() => setIsModalTop10client(false)}
        id={selectedClientId}
      />

      <Modal2Mois
        isOpen={isModal2Mois}
        onClose={() => setModal2Mois(false)}
        id={selectedClientId}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleDeleteClient}
        message="Êtes-vous sûr de vouloir supprimer ce client ?"
      />
    </div>
  );
}

function ArrowUpIcon(props) {
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
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function ChevronLeftIcon(props) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function ClockIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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

function PlusIcon(props) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
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

function XIcon(props) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

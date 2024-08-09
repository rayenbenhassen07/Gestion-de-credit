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
import { ConfirmDeleteModal } from "./ConfirmDeleteModal"; // Import the confirmation modal
import { LuArrowDownUp } from "react-icons/lu";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="mt-4 flex justify-center items-center">
      <Button
        onClick={handlePreviousPage}
        className="mx-1 border-2 border-grey-300 rounded-full"
        disabled={currentPage === 1}
      >
        {"<"}
      </Button>
      <span className="font-bold mx-5">{currentPage}</span>
      <Button
        onClick={handleNextPage}
        className="mx-1 border-2 border-grey-300 rounded-full"
        disabled={currentPage === totalPages}
      >
        {">"}
      </Button>
    </div>
  );
};

export function Dashboard() {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalCreditOlderThanTwoMonths, setTotalCreditOlderThanTwoMonths] =
    useState(0);
  const [topCreditClientsTotal, setTopCreditClientsTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust this value as needed

  const [isSortedByOldest, setIsSortedByOldest] = useState(false);
  const [isSortedByTotalCredit, setIsSortedByTotalCredit] = useState(false);
  const [isDefaultSorting, setIsDefaultSorting] = useState(true);
  const [pagin, setPagin] = useState(false);
  const [isDate, setDate] = useState(false);
  const [isCredit, setCredit] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await fetch(`https://cre.otospexerp.com/api/clients`);
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      } else {
        const data = await res.json();
        setError(data.error || "Échec de la récupération des clients");
      }
    } catch (error) {
      setError("Échec de la récupération des clients");
      console.error("Échec de la récupération des clients", error);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await fetch("https://cre.otospexerp.com/api/statistics");

      if (!res.ok) {
        const errorMsg = await res.json().catch(() => ({
          error: "Failed to fetch metrics",
        }));
        setError(errorMsg.error);
        return;
      }

      const {
        totalCredit,
        totalCreditOlderThanTwoMonths,
        topCreditClientsTotal,
      } = await res.json();

      setTotalCredit(totalCredit);
      setTotalCreditOlderThanTwoMonths(totalCreditOlderThanTwoMonths);
      setTopCreditClientsTotal(topCreditClientsTotal);
    } catch (error) {
      setError("Failed to fetch metrics");
      console.error("Failed to fetch metrics", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleDeleteClient = async () => {
    try {
      const res = await fetch(
        `https://cre.otospexerp.com/api/clients/${selectedClientId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setClients((prevClients) =>
          prevClients.filter((client) => client.id !== selectedClientId)
        );
        await fetchMetrics();
        setIsConfirmationModalOpen(false);
      } else {
        const data = await res.json();
        setError(data.error || "Échec de la suppression du client");
      }
    } catch (error) {
      setError("Échec de la suppression du client");
      console.error("Échec de la suppression du client", error);
    }
  };

  const handleOpenConfirmationModal = (clientId) => {
    setSelectedClientId(clientId);
    setIsConfirmationModalOpen(true);
  };

  const filteredClients = clients.filter((client) => {
    const lowerCaseSearch = search.toLowerCase();
    return (
      client.name.toLowerCase().includes(lowerCaseSearch) ||
      (client.num?.toLowerCase() || "").includes(lowerCaseSearch) ||
      (client.designation?.toLowerCase() || "").includes(lowerCaseSearch)
    );
  });

  const sortedClients = (() => {
    let clientsToSort = [...filteredClients];

    if (isSortedByOldest) {
      // Get current date and calculate the date 2 months ago
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

      // Filter clients older than 2 months and sort by oldest date
      clientsToSort = clientsToSort
        .filter((client) => new Date(client.date) < twoMonthsAgo)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 10);
    } else if (isSortedByTotalCredit) {
      // Sort by total credit and take top 10
      clientsToSort.sort((a, b) => b.gredit - a.gredit);
      clientsToSort = clientsToSort.slice(0, 10);
    } else {
      // Default sorting (most recent date)
      clientsToSort.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return clientsToSort;
  })();

  const afterSorting = (() => {
    let clientsToSort = [...sortedClients];

    if (isDate) {
      clientsToSort.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    if (isCredit) {
      clientsToSort.sort((a, b) => b.gredit - a.gredit);
    }

    return clientsToSort;
  })();

  const totalPages = Math.ceil(afterSorting.length / itemsPerPage);

  const displayedClients =
    search || pagin
      ? afterSorting
      : afterSorting.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        );

  if (isSortedByTotalCredit) {
    displayedClients.sort((a, b) => b.gredit - addEventListener.gredit);
  }
  console.log("sss=", pagin);

  // If you want to log displayedClients as well
  console.log("displayedClients = ", displayedClients);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(number);
  };

  const handleSortByOldest = () => {
    setIsSortedByOldest(true);
    setIsSortedByTotalCredit(false);
    setIsDefaultSorting(false);
    setPagin(true);
  };

  const handleSortByTotalCredit = () => {
    setIsSortedByOldest(false);
    setIsSortedByTotalCredit(true);
    setPagin(true);
    setIsDefaultSorting(false);
  };

  const handleDefaultSort = () => {
    setIsSortedByOldest(false);
    setIsSortedByTotalCredit(false);
    setIsDefaultSorting(true);
    setPagin(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card
          className="flex items-center justify-between p-4 bg-blue-100 hover:bg-blue-200 transition cursor-pointer"
          onClick={handleDefaultSort} // Default sorting
        >
          <div className="flex items-center">
            <RefreshCwIcon className="w-6 h-6 text-blue-800" />
            <div className="ml-4">
              <div className="text-2xl font-bold">
                {formatNumber(totalCredit)} TND
              </div>
              <div className="text-sm text-gray-600">Récap Total Crédit</div>
            </div>
          </div>
        </Card>
        <Card
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
          onClick={handleSortByOldest} // Sort by oldest
        >
          <div className="flex items-center">
            <ClockIcon className="w-6 h-6 text-blue-500" />
            <div className="ml-4">
              <div className="text-2xl font-bold">
                {formatNumber(totalCreditOlderThanTwoMonths)} TND
              </div>
              <div className="text-sm text-gray-600">
                Les 10 clients les plus anciens de plus de 2 mois
              </div>
            </div>
          </div>
        </Card>
        <Card
          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
          onClick={handleSortByTotalCredit} // Sort by total credit
        >
          <div className="flex items-center">
            <ArrowUpIcon className="w-6 h-6 text-blue-500" />
            <div className="ml-4">
              <div className="text-2xl font-bold">
                {formatNumber(topCreditClientsTotal)} TND
              </div>
              <div className="text-sm text-gray-600">
                Les 10 clients ayant le plus de crédit
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6 relative">
        <div className="flex items-center">
          <Input
            placeholder="Recherche par lettre ou numéro"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mr-2"
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
              <TableHead className="p-4  text-[10px] lg:text-sm">Nom</TableHead>
              <TableHead className="p-4 hidden lg:table-cell ">
                Numéro Téléphone
              </TableHead>
              <TableHead className="p-4  text-[10px] lg:text-sm cursor-pointer">
                <div
                  className="flex  items-center  gap-2"
                  onClick={() => setCredit(!isCredit)}
                >
                  <div className="flex gap-1">
                    <div>Total</div>
                    <div>Crédit</div>
                  </div>
                  <LuArrowDownUp />
                </div>
              </TableHead>
              <TableHead className="p-4 hidden lg:table-cell ">
                Désignation
              </TableHead>
              <TableHead
                className="p-4 cursor-pointer hidden lg:table-cell "
                onClick={() => setDate(!isDate)}
              >
                <div className="flex   gap-2">
                  <div>Date Dernière Crédit</div>
                  <LuArrowDownUp />
                </div>
              </TableHead>
              <TableHead className="p-4 flex justify-center items-center text-[10px] lg:text-sm">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedClients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="p-4 text-center text-gray-500"
                >
                  Aucun client trouvé.
                </TableCell>
              </TableRow>
            ) : (
              displayedClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="p-4 text-[10px] lg:text-sm">
                    {client.name}
                  </TableCell>
                  <TableCell className="p-4 hidden lg:table-cell">
                    {client.num}
                  </TableCell>
                  <TableCell
                    className={`p-4 text-[10px] lg:text-sm ${
                      isSortedByTotalCredit ? "text-red-500 font-bold" : ""
                    }`}
                  >
                    <div className="flex gap-1">
                      <div>{formatNumber(client.gredit)}</div>
                      <div>TND</div>
                    </div>
                  </TableCell>
                  <TableCell className="p-4 hidden lg:table-cell">
                    {client.designation}
                  </TableCell>
                  <TableCell
                    className={`p-4 hidden lg:table-cell ${
                      isSortedByOldest ? "text-red-500 font-bold" : ""
                    }`}
                  >
                    {new Date(client.date).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </TableCell>
                  <TableCell className="p-4 flex justify-center items-center lg:space-x-2">
                    <Button
                      onClick={() => {
                        router.push(`/transactions/trans/${client.id}`);
                      }}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!pagin && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

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

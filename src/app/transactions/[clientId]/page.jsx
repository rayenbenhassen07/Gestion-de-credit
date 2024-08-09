"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function ClientPage({ params }) {
  const { clientId } = params;
  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(
          `https://cre.otospexerp.com/api/clients/${clientId}`
        );
        if (res.ok) {
          const data = await res.json();
          setClient(data);
        } else {
          const data = await res.json();
          setError(data.error || "Failed to fetch client");
        }
      } catch (error) {
        setError("Failed to fetch client");
        console.error("Failed to fetch client", error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const res = await fetch(
          `https://cre.otospexerp.com/api/transactions/${clientId}`
        );
        if (res.ok) {
          const data = await res.json();
          setTransactions(data);
          setFilteredTransactions(data); // Initialize filtered transactions
        } else {
          const result = await res.json();
          setError(result.error || "Failed to fetch transactions");
        }
      } catch (error) {
        setError("Failed to fetch transactions");
        console.error("Failed to fetch transactions", error);
      }
    };

    fetchClient();
    fetchTransactions();
  }, [clientId]);

  useEffect(() => {
    let filtered = transactions;

    // Filter transactions based on the search term
    if (searchTerm) {
      filtered = filtered.filter((transaction) =>
        transaction.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter transactions based on the date
    if (dateFilter) {
      filtered = filtered.filter(
        (transaction) =>
          new Date(transaction.date).toLocaleDateString() ===
          new Date(dateFilter).toLocaleDateString()
      );
    }

    // Filter transactions based on the type
    if (typeFilter) {
      filtered = filtered.filter(
        (transaction) => transaction.type === typeFilter
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, dateFilter, typeFilter, transactions]);

  const handleBack = () => {
    router.push(`/clients/${clientId}`);
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formatNumber = (number) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(number);
  };

  if (!client) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <section className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </section>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-xs lg:text-base">
      <div className="bg-white p-4 rounded-md shadow-md mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div className="flex justify-center items-center gap-4 mb-4 lg:mb-0">
          <div onClick={handleBack} className="cursor-pointer">
            <BsArrowLeftCircleFill size="24" />
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              <div>
                <FaUserAlt size="24" />
              </div>
              <div className="flex flex-col items-start">
                <div>{client.name}</div>
                <div>{client.num}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Rechercher par designation"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded-md w-full lg:w-auto"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 border rounded-md w-full lg:w-auto"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2 border rounded-md w-full lg:w-auto"
          >
            <option value="">Tous types</option>
            <option value="achat">Achat</option>
            <option value="acompte">Acompte</option>
          </select>
        </div>
      </div>

      <div className=" h-[700px] mt-10 flex flex-col gap-10 justify-center items-center w-full">
        {client.oldCredit && (
          <div className=" text-xs lg:text-base bg-white p-4 flex justify-center items-center">
            {`Solde crédit avant application : ${formatNumber(
              client.oldCredit
            )} TND`}
          </div>
        )}
        <div className="h-full bg-gray-100 text-xs lg:text-base w-full">
          <div className="bg-white  rounded-md shadow-md mb-6">
            <div className="max-h-[600px] overflow-y-auto bg-white rounded-md shadow-md">
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader className="bg-blue-100">
                    <TableRow>
                      <TableHead className="p-1  lg:p-2 text-xs lg:text-base w-1/6 ">
                        Date
                      </TableHead>
                      <TableHead className="p-1 lg:p-2 text-xs lg:text-base w-1/6 ">
                        Nature/Designation
                      </TableHead>
                      <TableHead className="p-1 lg:p-2 text-xs lg:text-base  w-1/6">
                        Montant
                      </TableHead>
                      <TableHead className="p-1 lg:p-2 text-xs lg:text-base w-1/6 ">
                        Solde Crédit
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions
                        .filter((transaction) => !transaction.oldTrans)
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="p-3 lg:p-2 text-xs lg:text-base w-1/6">
                              {new Date(transaction.date)
                                .toLocaleString("en-CA", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: false,
                                })
                                .replace(",", "")}
                            </TableCell>
                            <TableCell className="p-1 lg:p-2 text-xs lg:text-base w-1/6">
                              {transaction.type} / {transaction.designation}
                            </TableCell>
                            <TableCell className="p-1 lg:p-2 text-xs lg:text-base w-1/6">
                              {transaction.type === "achat" ? "" : "-"}
                              {formatNumber(transaction.montant)} TND
                            </TableCell>
                            <TableCell className="p-1 lg:p-2 text-xs lg:text-base w-1/6">
                              {formatNumber(transaction.currentSoldeCredit)} TND
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan="4"
                          className="p-1 lg:p-2 text-center text-[8px] lg:text-lg"
                        >
                          Aucune transaction trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

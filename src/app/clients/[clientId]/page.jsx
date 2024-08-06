"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowAltCircleLeft, FaEye, FaUserAlt } from "react-icons/fa";

import { Modal } from "@/components/Modal"; // Import the modal component
import { ModalTransactions } from "@/components/ModalTransactions"; // Import the new modal component

export default function ClientPage({ params }) {
  const { clientId } = params;
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isModalTransactionsOpen, setIsModalTransactionsOpen] = useState(false); // State for transactions modal
  const [oldClientData, setOldClientData] = useState(null); // State for old client data
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/api/clients/${clientId}`);
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

    fetchClient();
  }, [clientId]);

  const handleBack = () => {
    router.push("/");
  };

  const handleAchat = () => {
    setIsModalOpen(true); // Open modal
  };

  const handleHistorique = () => {
    setIsModalTransactionsOpen(true); // Open transactions modal
  };

  const handleModalSubmit = async (data) => {
    try {
      const res = await fetch(`/api/clients/${clientId}/achat-acompte`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        console.log("Success:", result);
        setIsModalOpen(false); // Close modal
        fetchClient(); // Refetch client data
        router.refresh();
      } else {
        const result = await res.json();
        setError(result.error || "Failed to submit data");
      }
    } catch (error) {
      setError("Failed to submit data");
      console.error("Failed to submit data", error);
    }
  };

  const handleFetchOldClientData = async () => {
    try {
      if (oldClientData) {
        setOldClientData(null); // Hide old client data
        return;
      }

      const res = await fetch(`/api/oldClient/${clientId}`);
      if (res.ok) {
        const data = await res.json();
        setOldClientData(data);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to fetch old client data");
      }
    } catch (error) {
      setError("Failed to fetch old client data");
      console.error("Failed to fetch old client data", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

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
    <div className="p-6 bg-gray-100 min-h-screen font-semibold text-sm lg:font-bold lg:text-xl">
      <div className="flex justify-between items-center bg-white p-4">
        <div className="flex justify-center items-center gap-8 ">
          <div onClick={handleBack} className="cursor-pointer">
            <FaArrowAltCircleLeft size="32" />
          </div>
          <div className="flex justify-center items-center gap-4 ">
            <div className="flex justify-center items-center gap-4">
              <div className="">
                <FaUserAlt size="32" />
              </div>
              <div className="flex flex-col items-start ">
                <div>{client.name}</div>
                <div>{client.num}</div>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            router.push(`/transactions/${client.id}`);
          }}
          className="bg-blue-500 text-white"
        >
          Historique
        </Button>
      </div>

      {client.oldCredit ? (
        <div>
          <div className="mt-20 bg-white p-4 flex justify-center items-center">
            Solde crédit avant application : {client.oldCredit} TND{" "}
            {client.id <= 168 && (
              <FaEye
                size={25}
                className="ml-5 lg:ml-32 cursor-pointer"
                onClick={handleFetchOldClientData}
              />
            )}
          </div>
        </div>
      ) : (
        <></>
      )}

      {oldClientData && (
        <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-200 p-4 rounded">
              <span className="font-bold">Achat:</span> {oldClientData.achat}{" "}
              TND
            </div>
            <div className="bg-gray-200 p-4 rounded">
              <span className="font-bold">Acompte:</span>{" "}
              {oldClientData.accompte} TND
            </div>
            <div className="bg-gray-200 p-4 rounded">
              <span className="font-bold">Crédit avant app</span>{" "}
              {oldClientData.credit} TND
            </div>

            <div className="bg-gray-200 p-4 rounded">
              <span className="font-bold">Reste à Payer:</span>{" "}
              {oldClientData.resteAPayer} TND
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 p-4 bg-white flex flex-col gap-10 justify-center items-center ">
        <Button
          onClick={() => router.push(`/transactions/form/${client.id}`)}
          className="bg-green-500 w-[80%] lg:w-[50%] py-8 text-white font-bold text-xl"
        >
          Achat & Acompte
        </Button>

        <div>Montant crédit</div>

        <div className="w-[80%] lg:w-[50%] py-8 bg-red-500 text-white text-center font-bold text-xl">
          {client.gredit} TND
        </div>
      </div>
    </div>
  );
}

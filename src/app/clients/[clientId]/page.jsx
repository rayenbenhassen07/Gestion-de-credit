"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowAltCircleLeft } from "react-icons/fa";

import { Modal } from "@/components/Modal"; // Import the modal component
import { ModalTransactions } from "@/components/ModalTransactions"; // Import the new modal component
import Image from "next/image";

export default function ClientPage({ params }) {
  const { clientId } = params;
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isModalTransactionsOpen, setIsModalTransactionsOpen] = useState(false); // State for transactions modal
  const router = useRouter();

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
      } else {
        const result = await res.json();
        setError(result.error || "Failed to submit data");
      }
    } catch (error) {
      setError("Failed to submit data");
      console.error("Failed to submit data", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-semibold text-sm lg:font-bold lg:text-xl">
      {/* 
      client.designation}
          Date Added: {new Date(client.date).toLocaleDateString()}
      */}
      <div className="flex justify-between items-center bg-white p-4">
        <div className="flex justify-center items-center gap-8 ">
          <div onClick={handleBack} className="cursor-pointer">
            <FaArrowAltCircleLeft size="32" />
          </div>
          <div className="flex justify-center items-center gap-4 ">
            <div className="flex justify-center items-center gap-4">
              <div className="">
                <Image
                  alt=""
                  src="/avatar.png"
                  width={200}
                  height={200}
                  className="w-12 "
                />
              </div>
              <div className="flex flex-col items-start ">
                <div>{client.name}</div>
                <div>{client.num}</div>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleHistorique} className="bg-purple-500 text-white">
          Historique
        </Button>
      </div>

      <div className="mt-20 bg-white p-4 flex justify-center items-center">
        Solde crédit avant application : 236 000 TND
      </div>

      <div className="mt-20 p-4 bg-white  flex flex-col gap-10 justify-center items-center ">
        <Button
          onClick={handleAchat}
          className="bg-green-500 w-[80%] lg:w-[50%] py-8 text-white font-bold text-xl"
        >
          Achat & Acompte
        </Button>

        <div>Montant crédit</div>

        <div className="w-[80%] lg:w-[50%] py-8 bg-red-500 text-white text-center font-bold text-xl  ">
          {client.gredit} TND
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        id={clientId}
      />
      <ModalTransactions
        isOpen={isModalTransactionsOpen}
        onClose={() => setIsModalTransactionsOpen(false)}
        id={clientId}
      />
    </div>
  );
}

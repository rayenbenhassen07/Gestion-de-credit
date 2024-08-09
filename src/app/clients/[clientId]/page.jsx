"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaEye, FaUserAlt } from "react-icons/fa";
import { BsArrowLeftCircleFill } from "react-icons/bs";

import { Modal } from "@/components/Modal"; // Import the modal component
import { ModalTransactions } from "@/components/ModalTransactions"; // Import the new modal component
import { set } from "react-hook-form";

export default function ClientPage({ params }) {
  const { clientId } = params;
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [isModalTransactionsOpen, setIsModalTransactionsOpen] = useState(false); // State for transactions modal
  const [oldClientData, setOldClientData] = useState(false); // State for old client data
  const router = useRouter();

  useEffect(() => {
    router.refresh();
  }, []);

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

  const formatNumber = (number) => {
    return new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(number);
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
    <div className="p-2 lg:p-6 bg-gray-100 min-h-screen font-semibold text-sm lg:font-bold lg:text-xl">
      <div className="flex justify-between items-center bg-white p-2">
        <div className="flex justify-center items-center gap-2 ">
          <div onClick={handleBack} className="cursor-pointer">
            <BsArrowLeftCircleFill className="text-xl lg:text-3xl" />
          </div>
          <div className="flex justify-center items-center gap-4 ">
            <div className="flex justify-center items-center gap-4">
              <div className="">
                <FaUserAlt className="text-xl lg:text-3xl" />
              </div>
              <div className="flex flex-col items-start text-xs lg:text-base ">
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
          className="bg-blue-500 text-white text-xs lg:text-sm"
        >
          Historique
        </Button>
      </div>

      {client.oldCredit ? (
        <div>
          <div className="mt-20 text-xs lg:text-base bg-white p-4 flex justify-center items-center">
            Solde crédit avant application : {formatNumber(client.oldCredit)}{" "}
            TND{" "}
            {client.oldCredit && (
              <FaEye
                className="ml-5 lg:ml-32 cursor-pointer text-xl lg:text-3xl"
                onClick={() => setOldClientData(!oldClientData)}
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
              <span className="font-bold">Achat a crédit :</span>{" "}
              {client.achat ? formatNumber(client.achat) : "0.000"} TND
            </div>
            <div className="bg-gray-200 p-4 rounded">
              <span className="font-bold">Acompte :</span>{" "}
              {client.accompte ? formatNumber(client.accompte) : "0.000"} TND
            </div>
            <div className="bg-gray-200 p-4 rounded">
              <span className="font-bold">
                reste a payer le mois précédent :
              </span>{" "}
              {client.resteAPayer ? formatNumber(client.resteAPayer) : "0.000"}{" "}
              TND
            </div>

            <div className="bg-yellow-200 p-4 rounded">
              <span className="font-bold">montant crédit calculer :</span>{" "}
              {client.oldCredit ? formatNumber(client.oldCredit) : "0.000"} TND
            </div>
          </div>
        </div>
      )}

      <div className="mt-20 p-4 rounded-lg bg-white flex flex-col gap-10 justify-center items-center ">
        <Button
          onClick={() => router.push(`/transactions/form/${client.id}`)}
          className="bg-black w-[80%] lg:w-[50%] py-8 text-white font-boldtext-sm lg:text-xl"
        >
          Achat & Acompte
        </Button>

        <div className="text-xs lg:text-base">Montant crédit</div>

        <div className="w-[80%] lg:w-[50%] py-4 rounded-lg lg:py-8 bg-red-500 text-white text-center font-bold text-sm lg:text-xl">
          {formatNumber(client.gredit)} TND
        </div>
      </div>
    </div>
  );
}

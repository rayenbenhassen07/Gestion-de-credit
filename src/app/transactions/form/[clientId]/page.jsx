"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { BsArrowLeftCircleFill } from "react-icons/bs";

export default function ClientPage({ params }) {
  const { clientId } = params;
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);
  const [achatDate, setAchatDate] = useState(
    new Date().toISOString().slice(0, 16)
  ); // Set initial state to current date
  const [acompteDate, setAcompteDate] = useState(
    new Date().toISOString().slice(0, 16)
  ); // Set initial state to current date
  const [loading, setLoading] = useState(false); // Add loading state
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

    fetchClient();
  }, [clientId]);

  const handleBack = () => {
    router.push(`/clients/${clientId}`);
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true); // Set loading to true

    const formData = new FormData(event.target);

    const achatData = {
      type: "achat",
      montant: parseFloat(formData.get("achat_amount")),
      designation: formData.get("achat_designation"),
      date: achatDate || new Date().toISOString(),
      clientId: parseInt(clientId),
    };

    const acompteData = {
      type: "acompte",
      montant: parseFloat(formData.get("acompte_amount")),
      designation: formData.get("acompte_designation"),
      date: acompteDate || new Date().toISOString(),
      clientId: parseInt(clientId),
    };

    console.log("Achat Data:", achatData);
    console.log("Acompte Data:", acompteData);

    try {
      // Validate inputs before making requests
      if (!achatData.montant && !acompteData.montant) {
        console.error("Error: Both achat and acompte amounts are required.");
        return; // Stop further execution
      }

      if (achatData.montant) {
        const responseAchat = await fetch(
          "https://cre.otospexerp.com/api/transactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(achatData),
          }
        );

        if (responseAchat.ok) {
          const result = await responseAchat.json();
          console.log("Achat transaction created:", result);
        } else {
          const errorData = await responseAchat.json();
          console.error("Error creating achat transaction:", errorData);
        }

        // Add delay between requests
        await delay(500); // Delay for 500ms
      }

      if (acompteData.montant) {
        const responseAcompte = await fetch(
          "https://cre.otospexerp.com/api/transactions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(acompteData),
          }
        );

        if (responseAcompte.ok) {
          const result = await responseAcompte.json();
          console.log("Acompte transaction created:", result);
        } else {
          const errorData = await responseAcompte.json();
          console.error("Error creating acompte transaction:", errorData);
        }
      }

      // Navigate to the transactions page
      router.push(`/transactions/${clientId}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false after completion
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
    <div className="p-4 bg-gray-100 min-h-screen text-xs lg:text-base">
      <div className="bg-white p-4 rounded-md shadow-md mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div className="flex justify-center items-center gap-2 mb-4 lg:mb-0">
          <div onClick={handleBack} className="cursor-pointer">
            <BsArrowLeftCircleFill className="text-xl lg:text-3xl" />
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              <div>
                <FaUserAlt className="text-xl lg:text-3xl" />
              </div>
              <div className="flex flex-col items-start text-xs lg:text-sm">
                <div>{client.name}</div>
                <div>{client.num}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[700px] mt-10 flex flex-col gap-10 justify-center items-center w-full">
        <div className="h-full bg-gray-100 text-xs lg:text-base w-full">
          <div className="bg-white rounded-md shadow-md mb-6">
            <div className="p-4">
              <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
                {/* Achat Section */}
                <div className="flex lg:space-x-4 gap-4">
                  <div className="flex flex-col space-y-1 w-full lg:w-1/3">
                    <label className="text-xs lg:text-lg text-red-700 font-bold">
                      Achat
                    </label>
                    <input
                      type="number"
                      name="achat_amount"
                      placeholder="TND"
                      className="p-3 border rounded-md text-xs lg:text-lg w-full"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full lg:w-1/3">
                    <label className="text-xs lg:text-lg text-gray-700">
                      Désignation
                    </label>
                    <input
                      type="text"
                      name="achat_designation"
                      className="p-3 border rounded-md text-xs lg:text-lg w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full lg:w-1/3">
                    <label className="text-xs lg:text-lg text-gray-700">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="achat_date"
                        value={achatDate}
                        onChange={(e) => setAchatDate(e.target.value)}
                        className="p-3 border rounded-md text-xs lg:text-lg w-20 lg:w-full lg:pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Acompte Section */}
                <div className="flex lg:space-x-4 gap-4">
                  <div className="flex flex-col space-y-1 w-full lg:w-1/3">
                    <label className="text-xs lg:text-lg text-green-700 font-bold">
                      Acompte
                    </label>
                    <input
                      type="number"
                      name="acompte_amount"
                      placeholder="TND"
                      className="p-3 border rounded-md text-xs lg:text-lg w-full"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full lg:w-1/3">
                    <label className="text-xs lg:text-lg text-gray-700">
                      Désignation
                    </label>
                    <input
                      type="text"
                      name="acompte_designation"
                      className="p-3 border rounded-md text-xs lg:text-lg w-full"
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full lg:w-1/3">
                    <label className="text-xs lg:text-lg text-gray-700">
                      Date
                    </label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        name="acompte_date"
                        value={acompteDate}
                        onChange={(e) => setAcompteDate(e.target.value)}
                        className="p-3 border rounded-md text-xs lg:text-lg w-20 lg:w-full lg:pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center ">
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white p-5 lg:p-8 rounded lg:text-3xl text-xl"
                  >
                    {loading ? "Chargement en cours..." : "Enregistrer"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

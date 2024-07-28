"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Modal({ isOpen, onClose, id }) {
  // State and effect hooks should be defined here at the top level
  const [currentDate, setCurrentDate] = useState("");

  // Effect hook to set the current date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);

  // Early return if the modal is not open
  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      type: formData.get("type"),
      montant: parseFloat(formData.get("amount")),
      designation: formData.get("designation"),
      date: formData.get("date") || new Date().toISOString(),
      clientId: parseInt(id),
    };

    try {
      console.log("data", data);
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Transaction created:", result);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Error creating transaction:", errorData);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-10 rounded-md shadow-lg w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-6">Achat & Acompte</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="achat"
                  name="type"
                  value="achat"
                  className="hidden"
                  required
                />
                <label
                  htmlFor="achat"
                  className="cursor-pointer flex items-center p-3 rounded-md text-red-500 text-lg space-x-2"
                >
                  <input
                    type="radio"
                    id="achat"
                    name="type"
                    value="achat"
                    className="w-6 h-6 accent-red-500"
                    required
                  />
                  <span>Achat</span>
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="acompte"
                  name="type"
                  value="acompte"
                  className="hidden"
                  required
                />
                <label
                  htmlFor="acompte"
                  className="cursor-pointer flex items-center p-3 rounded-md text-green-500 text-lg space-x-2"
                >
                  <input
                    type="radio"
                    id="acompte"
                    name="type"
                    value="acompte"
                    className="w-6 h-6 accent-green-500"
                    required
                  />
                  <span>Acompte</span>
                </label>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-lg text-gray-700">Amount</label>
                <input
                  type="number"
                  name="amount"
                  required
                  className="p-3 border rounded-md text-lg"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-lg text-gray-700">Designation</label>
                <input
                  type="text"
                  name="designation"
                  required
                  className="p-3 border rounded-md text-lg"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-lg text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={currentDate}
                  onChange={(e) => setCurrentDate(e.target.value)}
                  className="p-3 border rounded-md text-lg"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white text-lg"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-green-500 text-white text-lg">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

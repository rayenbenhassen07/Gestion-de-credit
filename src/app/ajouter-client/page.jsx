"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaArrowAltCircleLeft } from "react-icons/fa";

export default function AjouterClient() {
  const [formData, setFormData] = useState({
    name: "",
    num: "",
    credit: "",
    designation: "",
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBack = () => {
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/"); // Redirect to home page or any other page after success
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create client");
      }
    } catch (error) {
      setError("Failed to create client");
      console.error("Failed to create client", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        onClick={handleBack}
        className="absolute top-10 left-10 cursor-pointer"
      >
        <FaArrowAltCircleLeft size="40" />
      </div>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">
          Ajouter nouveau Client
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="num"
                className="block text-sm font-medium text-gray-700"
              >
                Numéro téléphone
              </label>
              <input
                type="text"
                id="num"
                name="num"
                value={formData.num}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="credit"
                className="block text-sm font-medium text-gray-700"
              >
                Total crédit
              </label>
              <input
                type="number"
                id="credit"
                name="credit"
                value={formData.credit}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="designation"
                className="block text-sm font-medium text-gray-700"
              >
                Désignation
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="block w-full px-4 py-2 mt-1 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

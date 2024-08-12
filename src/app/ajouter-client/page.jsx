"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsArrowLeftCircleFill } from "react-icons/bs";

export default function AjouterClient() {
  const [formData, setFormData] = useState({
    name: "",
    num: "",
    credit: "",
    designation: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
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
    setLoading(true); // Set loading state to true

    try {
      const res = await fetch("https://cre.otospexerp.com/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/"); // Redirect to home page or any other page after success
      }
    } catch (error) {
      setError("Numéro de téléphone existe déjà");
      console.error("Failed to create client", error);
    } finally {
      setLoading(false); // Set loading state to false after request
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100">
      <div className=" bg-white lg:bg-gray-100 w-full p-4 lg:pl-10 pt-10 rounded-md  mb-6 flex justify-between items-start ">
        <div className="flex justify-center items-center gap-2 mb-4 lg:mb-0">
          <div onClick={handleBack} className="cursor-pointer">
            <BsArrowLeftCircleFill className="text-xl lg:text-3xl" />
          </div>
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              <div className="flex flex-col items-start text-xs  lg:hidden lg:text-sm">
                Ajouter Nouveau Client
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center items-center mt-20">
        <div className="w-full  max-w-7xl p-8 space-y-6 bg-white rounded shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
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
                  className="block w-full px-6 py-3 mt-1 text-lg border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  type="number"
                  id="num"
                  name="num"
                  value={formData.num}
                  onChange={handleChange}
                  className="block w-full px-6 py-3 mt-1 text-lg border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  className="block w-full px-6 py-3 mt-1 text-lg border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                  className="block w-full px-6 py-3 mt-1 text-lg border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className={`w-full px-4 py-3 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 text-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button if loading
            >
              {loading ? "Chargement en cours..." : "Enregistrer"}{" "}
              {/* Show loading text or submit text */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

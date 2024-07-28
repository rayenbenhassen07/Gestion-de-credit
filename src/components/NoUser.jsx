"use client";
import { useRouter } from "next/navigation";

export default function NoUser() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">
        Veuillez vous connecter pour accéder à l'application.
      </h1>
      <button
        onClick={handleLoginRedirect}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Se connecter
      </button>
    </div>
  );
}

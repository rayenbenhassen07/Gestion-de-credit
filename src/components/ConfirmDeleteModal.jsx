import { Button } from "@/components/ui/button";
import { IoCloseCircleSharp } from "react-icons/io5";

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, clientId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoCloseCircleSharp className="w-8 h-8" />
        </button>

        {/* Modal Content */}
        <h2 className="text-2xl font-bold mb-6 text-center">Alert</h2>
        <p className="text-center mb-8 text-lg">
          Vous êtes sûr de vouloir supprimer ce client ?
        </p>
        <div className="flex justify-center space-x-6">
          <Button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 text-lg"
          >
            Annuler
          </Button>
          <Button
            onClick={() => {
              onConfirm(clientId);
              onClose();
            }}
            className="bg-red-500 text-white py-2 px-4 text-lg"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}

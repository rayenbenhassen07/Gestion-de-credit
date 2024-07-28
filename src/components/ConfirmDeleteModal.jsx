import { Button } from "@/components/ui/button";

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, clientId }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Confirmation de Suppression</h2>
        <p>Êtes-vous sûr de vouloir supprimer ce client ?</p>
        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-500 text-white">
            Annuler
          </Button>
          <Button
            onClick={() => {
              onConfirm(clientId), onClose();
            }}
            className="bg-red-500 text-white"
          >
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}

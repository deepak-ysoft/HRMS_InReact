import { ConfirmDeleteProps } from "../../types/IConfirmDeleteProps.types";

export const ConfirmDelete: React.FC<ConfirmDeleteProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed p-5 inset-0 flex items-start justify-end z-50">
      <div className="bg-base-100 border rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this item?</p>
        <div className="mt-4 flex justify-end">
          <button className="btn text-black bg-[rgb(202,194,255)] mr-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn text-black bg-[rgb(222,102,102)]" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

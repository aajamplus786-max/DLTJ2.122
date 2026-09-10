// =====================================================
// DLTJ2.1
// WORKING TOOL
// FILE: src/components/workingTools/DeleteDialog.tsx
// =====================================================

import FileDialog from "./FileDialog";

interface DeleteDialogProps {
  itemName: string;
  onDelete: () => void;
  onClose: () => void;
}

export default function DeleteDialog({
  itemName,
  onDelete,
  onClose,
}: DeleteDialogProps) {
  return (
    <FileDialog
      title="Delete Item"
      onClose={onClose}
      onSubmit={onDelete}
      submitLabel="Delete"
    >
      <div className="delete-dialog-content">
        <div className="delete-dialog-icon">
          ⚠
        </div>

        <p>
          Are you sure you want to delete
          <strong> {itemName}</strong>?
        </p>

        <small>
          This action cannot be undone.
        </small>
      </div>
    </FileDialog>
  );
}
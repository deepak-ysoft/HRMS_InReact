import { EmployeeAsset } from "../../../types/IEmployeeAsset.types";
import { AssetsForm } from "./AddEditAssets";
import { AssetsPage } from "./Assets";
import { useState } from "react";

export const Assets = () => {
  const [editAsset, setEditAsset] = useState<Partial<EmployeeAsset> | null>(
    null
  );
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => {
    setReloadKey((k) => k + 1);
  };

  const handleEdit = (asset: Partial<EmployeeAsset>) => {
    setEditAsset(asset);
    setReloadKey((k) => k + 1); // Force reload on edit as well
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <AssetsPage onEdit={handleEdit} reloadKey={reloadKey} />
      </div>
      <div>
        <AssetsForm
          editData={editAsset}
          onClose={() => setEditAsset(null)}
          onSubmitSuccess={handleReload}
        />
      </div>
    </div>
  );
};

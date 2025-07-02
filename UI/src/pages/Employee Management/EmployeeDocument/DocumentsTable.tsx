import React from "react";

interface DocumentVM {
  id: number;
  employeeId: number;
  documentType: string;
  fileName: string;
  uploadedAt: string;
  expiryDate: string | null;
}

interface Props {
  documents: DocumentVM[];
  loading: boolean;
  onDownload: (documentId: number, fileName: string) => void;
}

export const DocumentsTable: React.FC<Props> = ({
  documents,
  loading,
  onDownload,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }
  if (!documents) {
    return (
      <div className="text-center text-lg text-gray-500 mt-8">
        No documents found for this employee or no employee ID entered.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="table w-full">
        <thead>
          <tr className="bg-primary text-primary-content">
            <th>ID</th>
            <th>Employee ID</th>
            <th>Document Type</th>
            <th>File Name</th>
            <th>Uploaded At</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="hover:bg-base-200">
              <td>{doc.id}</td>
              <td>{doc.employeeId}</td>
              <td>{doc.documentType}</td>
              <td>{doc.fileName}</td>
              <td>{new Date(doc.uploadedAt).toLocaleDateString()}</td>
              <td>
                {doc.expiryDate
                  ? new Date(doc.expiryDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline btn-info rounded-md"
                  onClick={() => onDownload(doc.id, doc.fileName)}
                >
                  Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

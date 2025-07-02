import React, { useState } from "react";
import { getDocumentsQuery } from "../../../services/Employee Management/EmployeeDocument/GetDocuments.query";
import { DownloadDocumentQuery } from "../../../services/Employee Management/EmployeeDocument/DownloadDocument.query";
import { ViewDocumentsForm } from "./ViewDocumentsForm";
import { DocumentsTable } from "./DocumentsTable";
import { UploadDocumentQuery } from "../../../services/Employee Management/EmployeeDocument/UploadDocument.query";
import { toast } from "react-toastify";
import { EmployeeDocument } from "../../../types/IEmployeeDocument.type";
import { DocumentUploadInputs } from "../../../types/DocumentUploadInputs.type";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { useForm } from "react-hook-form";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";

const EmployeeDocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DocumentUploadInputs & { searchEmployeeId: string }>();

  // Fetch documents for a given employee
  const fetchDocumentsForEmployee = async (employeeId: number) => {
    setLoading(true);
    try {
      const data = await getDocumentsQuery(employeeId);
      setDocuments(data?.data || []);
      setLoading(false);
      toast.success(`Documents loaded for employee ID: ${employeeId}`);
    } catch (error) {
      setDocuments([]);
      toast.error((error as Error).message || "Failed to fetch documents.");
    } finally {
      setLoading(false);
    }
  };

  const onUploadSubmit = async (data: DocumentUploadInputs) => {
    setUploading(true);

    const numericEmployeeId = Number(data.employeeId);
    if (isNaN(numericEmployeeId)) {
      toast.error("Employee ID must be a valid number.");
      setUploading(false);
      return;
    }

    if (!data.file || data.file.length === 0) {
      toast.error("Please select a file to upload.");
      setUploading(false);
      return;
    }

    await UploadDocumentQuery(
      numericEmployeeId,
      data.file[0],
      data.documentType,
      data.expiryDate ? new Date(data.expiryDate) : undefined
    );
    toast.success("Document uploaded successfully!");

    setUploading(false);
    reset({
      employeeId: data.employeeId,
      documentType: "",
      expiryDate: "",
      file: undefined,
    });

    fetchDocumentsForEmployee(numericEmployeeId);
  };

  // Handle document download
  const handleDownloadDocument = async (
    documentId: number,
    fileName: string
  ) => {
    try {
      const blob = await DownloadDocumentQuery(documentId.toString());
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloading ${fileName}...`);
    } catch (error) {
      toast.error((error as Error).message || "Failed to download document.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 font-inter">
      <div className="card w-full max-w-5xl mx-auto shadow-2xl bg-base-100 p-8 rounded-box">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Employee Document Management
        </h2>

        {/* Upload Form */}
        <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-secondary mb-4">
            Upload New Document
          </h3>
          <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                type="text"
                name="employeeId"
                label="Employee ID"
                placeholder="e.g., 101"
                register={register}
                registerOptions={{
                  required: "Employee ID is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Employee ID must be numeric",
                  },
                }}
                error={errors.employeeId}
              />
              <FormField
                type="text"
                name="documentType"
                label="Document Type"
                placeholder="e.g., Resume, ID Proof"
                register={register}
                registerOptions={{ required: "Document Type is required" }}
                error={errors.documentType}
              />
              <FormField
                type="date"
                name="expiryDate"
                label="Expiry Date (Optional)"
                register={register}
                error={errors.expiryDate}
              />
            </div>
            <FormField
              type="file"
              name="file"
              label="Select File"
              setValue={setValue}
              registerOptions={{ required: "File is required" }}
              error={errors.file}
            />
            <div className="form-control mt-4">
              <Button
                type="submit"
                className="btn btn-primary rounded-md btn-block"
                disabled={uploading}
                text={uploading ? "Uploading..." : "Upload Document"}
              />
            </div>
          </form>
        </div>

        {/* View Documents Form */}
        <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-secondary mb-4">
            View Employee Documents
          </h3>
          <ViewDocumentsForm
            loading={loading}
            onView={fetchDocumentsForEmployee}
          />
        </div>

        {/* Documents Table */}
        <DocumentsTable
          documents={documents || []}
          loading={loading}
          onDownload={handleDownloadDocument}
        />
      </div>
    </div>
  );
};

export default EmployeeDocumentManagement;

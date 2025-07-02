import axiosInstance from "../../../../axiosInstance";

export const DownloadPayslipQuery = async (
  employeeId: number,
  year: number,
  month: number
) => {
  try {
    const response = await axiosInstance.get(
      `/api/Payroll/slip/${employeeId}/${year}/${month}`,
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payslip_${employeeId}_${month}_${year}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert(error);
  }
};

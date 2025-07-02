import { useEffect, useState } from "react";
import AttendanceSection from "./AttendanceSection";
import PayrollSection from "./PayrollSection";
import DocumentsSection from "./DocumentsSection";
import PerformanceReviewSection from "./PerformanceReviewSection";
import EmployeeDetails from "./EmployeeDetails";
import { Tab, Tabs } from "../../../../components/Tabs/Tabs";
import { EmployeeVM } from "../../../../types/IEmployee.type";
import { useQuery } from "@tanstack/react-query";
import { EmployeeDetailsQuery } from "../../../../services/Employee Management/Employee/EmployeeDetailsquery";
import { BreadCrumbsComponent } from "../../../../components/Breadcrumbs/BreadCrumbsComponents";
import { useParams } from "react-router-dom";

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<EmployeeVM>();

  const { id } = useParams();
  const EmployeeId = Number(id);
  console.log("EmployeeId", EmployeeId);
  const { data } = useQuery({
    queryKey: ["getEmployee", EmployeeId],
    queryFn: () => EmployeeDetailsQuery(EmployeeId),
  });
  useEffect(() => {
    if (data) {
      setProfileData(data?.data?.employee);
    }
  }, [data]);

  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <BreadCrumbsComponent />
      <div className="p-6 max-w-7xl mx-auto">
        <EmployeeDetails data={profileData} />

        <div className="mt-8 ">
          <Tabs mode="view" activeTab={activeTab} setActiveTab={setActiveTab}>
            <Tab title="Attendance" name="attendance">
              <AttendanceSection empId={EmployeeId} />
            </Tab>
            <Tab title="Payroll" name="payroll">
              <PayrollSection empId={EmployeeId} />
            </Tab>
            <Tab title="Documents" name="documents">
              <DocumentsSection empId={EmployeeId} />
            </Tab>
            <Tab title="Reviews" name="reviews">
              <PerformanceReviewSection empId={EmployeeId} />
            </Tab>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Profile;

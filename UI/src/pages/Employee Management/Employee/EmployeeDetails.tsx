import { useLocation } from "react-router-dom";
import { Employee } from "../../../types/IEmployee.type";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";

export const EmployeeDetails: React.FC = () => {
  const location = useLocation();
  const employee: Employee = location.state as Employee;
  const apiPath = import.meta.env.VITE_API_BASE_URL;

  return (
    <>
      <BreadCrumbsComponent />
      <div className="flex flex-col md:flex-row gap-5">
        <div className=" lg:w-1/3">
          <div className="p-5 flex flex-col items-center bg-base-100 rounded-lg shadow-md w-full">
            <img
              src={`${apiPath + employee.imagePath}`}
              alt={employee.empName}
              className="w-32 h-32 object-cover rounded-full mb-4"
            />
            <div className="font-bold text-lg mb-1">{employee.empName}</div>
            <div className="text-base-400 mb-1">{employee.empEmail}</div>
            <div className="text-base-400 mb-1">{employee.role || "-"}</div>
          </div>
        </div>
        <div className="col-span-2 bg-base-100 p-5 rounded-lg shadow-md w-full lg:w-2/3 flex flex-col gap-2">
          <div className="w-full lg:w-[90%]  mb-2">
            <div className="ml-12">
              <label className="block text-sm font-semibold text-base-700">
                Mobile
              </label>
              <div className="border rounded px-3 py-2 bg-base-200 ">
                {employee.empNumber}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[90%]  mb-2">
            <div className="ml-12">
              <label className="block text-sm font-semibold text-base-700">
                DOB
              </label>
              <div className="border rounded px-3 py-2 bg-base-200 ">
                {employee.empDateOfBirth}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[90%]  mb-2">
            <div className="ml-12">
              <label className="block text-sm font-semibold text-base-700">
                Gender
              </label>
              <div className="border rounded px-3 py-2 bg-base-200 ">
                {employee.empGender}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[90%]  mb-2">
            <div className="ml-12">
              <label className="block text-sm font-semibold text-base-700">
                Address
              </label>
              <div className="border rounded px-3 py-2 bg-base-200 ">
                {employee.empAddress}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[90%]  mb-2">
            <div className="ml-12">
              <label className="block text-sm font-semibold text-base-700">
                Active
              </label>
              <div className="border rounded px-3 py-2 bg-base-200 ">
                {employee.isActive ? "Yes" : "No"}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[90%]  mb-2">
            <div className="ml-12">
              <label className="block text-sm font-semibold text-base-700">
                Experience
              </label>
              <div className="border rounded px-3 py-2 bg-base-200 ">
                {employee.empExperience}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[90%]  mb-2">
            <div className="ml-12">
              <label className="block text-sm font-semibold text-base-700">
                Joining Date
              </label>
              <div className="border rounded px-3 py-2 bg-base-200 ">
                {employee.empDateofJoining}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[90%]  mb-2">
            <div className="ml-12">
              <label className="block text-sm font-semibold text-base-700">
                Job Title
              </label>
              <div className="border rounded px-3 py-2 bg-base-200 ">
                {employee.empJobTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

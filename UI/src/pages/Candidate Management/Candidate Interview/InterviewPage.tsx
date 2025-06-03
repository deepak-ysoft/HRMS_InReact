import { useQuery } from "@tanstack/react-query";
import { Interviews } from "./Interviews";
import { InterviewData } from "../../../services/Candidate/InterviewData.query";
import { Column } from "../../../components/ListComponent/ListComponent";
import { BreadCrumbsComponent } from "../../../components/Breadcrumbs/BreadCrumbsComponents";
import { useNavigate } from "react-router-dom";
import { Candidate } from "../../../types/ICandidate";
import dayjs from "dayjs";

export const InterviewPage = () => {
  const navigate = useNavigate();
  const { data, isPending } = useQuery({
    queryKey: ["getInterviews"],
    queryFn: () => InterviewData(),
  });

  const columns: Column<
    Record<string, string | number | File | null | undefined>
  >[] = [
    {
      header: "Name",
      accessor: "name",
      render: (row) => {
        return (
          <div onClick={() => handleClick(row as Candidate)}>
            {String(row.name)}
          </div>
        );
      },
    },
    {
      header: "Email",
      accessor: "email_ID",
      render: (row) => {
        return (
          <div onClick={() => handleClick(row as Candidate)}>
            {String(row.email_ID)}
          </div>
        );
      },
    },
    {
      header: "Contact No",
      accessor: "contact_No",
      render: (row) => {
        return (
          <div onClick={() => handleClick(row as Candidate)}>
            {String(row.contact_No)}
          </div>
        );
      },
    },
    {
      header: "Role",
      accessor: "roles",
      render: (row) => {
        return (
          <div onClick={() => handleClick(row as Candidate)}>
            {String(row.roles)}
          </div>
        );
      },
    },
    {
      header: "Schedule Interview",
      accessor: "schedule_Interview",
      render: (row) => {
        return (
          <div onClick={() => handleClick(row as Candidate)}>
            {dayjs(row.schedule_Interview).format("DD-MM-YYYY hh:mm A")}
          </div>
        );
      },
    },
  ];
  const handleClick = (row: Candidate) => {
    navigate(`/interview/candidateDetails`, { state: row });
  };

  return (
    <div>
      <BreadCrumbsComponent />
      <div className="flex w-full gap-4 p-3">
        <div className="w-full">
          <Interviews
            pageName="Today Interviews"
            isPending={isPending}
            data={data?.todayData}
            columns={columns}
          />
        </div>
        <div className="w-full ">
          <Interviews
            pageName="Week Interviews"
            isPending={isPending}
            data={data?.weekData}
            columns={columns}
          />
        </div>
      </div>
    </div>
  );
};

import axiosInstance from "../../../axiosInstance";
import { ILeadsParams } from "../../types/ILeads.type";

export const GetLeadsQuery = async ({
  page,
  pageSize,
  searchValue,
}: ILeadsParams) => {
  const response = await axiosInstance.get(
    `api/Leads/GetLeads?page=${page}&pageSize=${pageSize}&SearchValue=${searchValue}`
  );
  return response.data;
};

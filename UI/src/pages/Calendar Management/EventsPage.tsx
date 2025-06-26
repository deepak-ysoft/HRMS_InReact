import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ICalendar } from "../../types/ICalendar.type";
import { BreadCrumbsComponent } from "../../components/Breadcrumbs/BreadCrumbsComponents";
import { Column } from "../../components/ListComponent/ListComponent";
import { getEvents } from "../../services/Calendar/GetEvents.query";
import { EventsComponent } from "./EventsComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaUserEdit } from "react-icons/fa";
import { faEye, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { DeleteCalendarEventQuery } from "../../services/Calendar/DeleteCalendarEvent.query";
import { ConfirmDelete } from "../../components/DeletionConfirm/ConfirmDelete";
import { EventModel } from "./EventModal"; // Import your modal
import { UpdateCalendarEventQuery } from "../../services/Calendar/UpdateCalendarEvent.query";
import dayjs from "dayjs";

export const EventsPage: React.FC<{
  onEdit?: (asset: Partial<ICalendar>) => void;
  reloadKey?: number;
}> = ({ reloadKey }) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: ["getAssets", reloadKey],
    queryFn: () => getEvents(),
  });

  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setShowDelete(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    const data = await DeleteCalendarEventQuery(deleteId);
    refetch();
    setShowDelete(false);
    setDeleteId(null);
    if (data.isSuccess) {
      toast.success(data.message);
    } else {
      toast.warning(data.message);
    }
  };

  const handleDeleteCancel = () => {
    setShowDelete(false);
    setDeleteId(null);
  };

  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ICalendar | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Handler for opening modal in view mode
  const handleView = (row: ICalendar) => {
    setSelectedEvent(row as ICalendar);
    setIsEditMode(false);
    setShowEventModal(true);
  };

  // Handler for opening modal in edit mode
  const handleEdit = (row: ICalendar) => {
    setSelectedEvent(row as ICalendar);
    setIsEditMode(true);
    setShowEventModal(true);
  };

  // Handler for closing modal
  const handleCloseModal = () => {
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  const handleSave = async (formData: FormData) => {
    const result = await UpdateCalendarEventQuery(formData);

    if (result.isSuccess) {
      toast.success(result.message);
    } else {
      toast.warning(result.message);
    }

    handleCloseModal();
    refetch();
  };

  const birthdayColumns: Column<
    Record<string, string | number | File | null | undefined>
  >[] = [
    { header: "Birthday", accessor: "description" },
    {
      header: "Birth Date",
      accessor: "start",
      render: (row) => {
        return (
          <>
            <p> {dayjs(row.start as string).format("DD-MM-YYYY")}</p>
          </>
        );
      },
    },
    { header: "", accessor: "" },
  ];
  const columns: Column<
    Record<string, string | number | File | null | undefined>
  >[] = [
    { header: "Description", accessor: "description" },
    {
      header: "Start",
      accessor: "start",
      render: (row) => {
        return (
          <>
            <p> {dayjs(row.start as string).format("DD-MM-YYYY hh:mm A")}</p>
          </>
        );
      },
    },
    {
      header: "End",
      accessor: "end",
      render: (row) => {
        return (
          <>
            <p> {dayjs(row.end as string).format("DD-MM-YYYY hh:mm A")}</p>
          </>
        );
      },
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <>
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faEye}
              onClick={() => handleView(row as ICalendar)}
              className="text-[rgb(66,42,213)] text-[15px] hover:text-[rgb(43,36,85)] cursor-pointer transition-all duration-200 hover:scale-110"
              title="View"
            />
            <FaUserEdit
              onClick={() => handleEdit(row as ICalendar)}
              className="text-[rgb(159,145,251)] text-[18px] hover:text-[rgb(105,90,209)] cursor-pointer transition-all duration-200 hover:scale-110"
              title="Edit"
            />
            <FontAwesomeIcon
              icon={faTrashCan}
              className="text-[#FF4C4C] hover:text-[#cc0000] text-[15px] cursor-pointer transition-all duration-200 hover:scale-110"
              title="Delete"
              onClick={() => handleDeleteClick(Number(row.calId))}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <BreadCrumbsComponent />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-4">
        {[
          { dataKey: "meeting", columns, pageName: "Meeting" },
          { dataKey: "holiday", columns, pageName: "Holiday" },
          { dataKey: "events", columns, pageName: "Events" },
          { dataKey: "leave", columns, pageName: "Leave" },
          {
            dataKey: "birthday",
            columns: birthdayColumns,
            pageName: "Birthday",
          },
        ].map((item, index) => (
          <div key={index}>
            <EventsComponent
              isPending={isPending}
              data={data?.data?.[item.dataKey] || []}
              columns={item.columns}
              pageName={item.pageName}
            />
          </div>
        ))}

        {showEventModal && (
          <EventModel
            open={showEventModal}
            onClose={handleCloseModal}
            eventData={selectedEvent}
            onSave={handleSave}
            onDelete={() => {}}
            isEdit={isEditMode}
            disabled={!isEditMode}
            isFromEvent={true}
          />
        )}

        {showDelete && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-20">
            <ConfirmDelete
              isOpen={showDelete}
              onDelete={handleDeleteConfirm}
              onClose={handleDeleteCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

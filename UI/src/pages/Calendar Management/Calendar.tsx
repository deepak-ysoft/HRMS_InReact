// Calendar.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for drag, drop, click
import { BreadCrumbsComponent } from "../../components/Breadcrumbs/BreadCrumbsComponents";
import { useQuery } from "@tanstack/react-query";
import { GetCalendarQuery } from "../../services/Calendar/GetCalendarEvents.query";
import { useState } from "react";
import { ICalendar } from "../../types/ICalendar.type";
import { GetCalendarByIdQuery } from "../../services/Calendar/GetCalendarDetails.query";
import { UpdateCalendarEventQuery } from "../../services/Calendar/UpdateCalendarEvent.query";
import { CreateCalendarEventQuery } from "../../services/Calendar/CreateCalendarEvent.query";
import { DeleteCalendarEventQuery } from "../../services/Calendar/DeleteCalendarEvent.query";
import { EventModel } from "./EventModal";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { toast } from "react-toastify";
import { ConfirmDelete } from "../../components/DeletionConfirm/ConfirmDelete";
import { handleEventDrop } from "./handleEventDrop";

const Calendar = () => {
  const { data, isPending, refetch } = useQuery<{ data: ICalendar[] }>({
    queryKey: ["getCalendar"],
    queryFn: GetCalendarQuery,
  });
  const [selectedEvent, setSelectedEvent] = useState<ICalendar | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsEdit(false);
    setShowModal(true);
  };

  const handleEventClick = async (info: { event: { id: string } }) => {
    const calId = parseInt(info.event.id);
    const response = await GetCalendarByIdQuery(calId);
    setSelectedEvent(response.data);
    setIsEdit(true);
    setShowModal(true);
  };

  const handleSave = async (formData: FormData) => {
    const calId = formData.get("calId");
    if (isEdit && calId && parseInt(calId.toString()) !== 0) {
      const result = await UpdateCalendarEventQuery(formData);
      if (result.isSuccess) {
        toast.success(result.message);
      } else {
        toast.warning(result.message);
      }
    } else {
      const result = await CreateCalendarEventQuery(formData);
      if (result.isSuccess) {
        toast.success(result.message);
      } else {
        toast.warning(result.message);
      }
    }
    setShowModal(false);
    setSelectedEvent(null);
    refetch();
  };

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
    setShowModal(false);
    setSelectedEvent(null);
    // Show custom toast from toast.ts
    if (data.isSuccess) {
      toast.success(data.message);
    } else {
      toast.warning(data.message);
    }
  };

  const handleDeleteCancel = () => {
    setShowDelete(false);
    setDeleteId(null);
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between   mb-4">
        <BreadCrumbsComponent />
        <Button
          type="button"
          className="bg-[rgb(66,42,213)] text-white"
          onClick={handleAddEvent}
          text="Add Event"
        />
      </div>
      <div className="bg-base-100 max-h-[740px] overflow-auto shadow-md rounded-lg p-6">
        {!isPending && (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            eventDrop={handleEventDrop}
            events={(data?.data ?? []).map((item) => ({
              id: item?.calId?.toString() ?? "",
              title: item?.title.toString(),
              start: item?.start,
              end: item?.end,
              description: item?.description,
              backgroundColor: "rgb(202,194,255)",
              borderColor: "rgb(202,194,255)", // green-500
              textColor: "#000000",
            }))}
            editable={true}
            selectable={true}
            dateClick={handleAddEvent}
            eventClick={handleEventClick}
          />
        )}
      </div>
      <EventModel
        open={showModal}
        onClose={() => setShowModal(false)}
        eventData={selectedEvent}
        onSave={handleSave}
        onDelete={handleDeleteClick}
        isEdit={isEdit}
      />
      {showDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-slide-in-fade-out">
          <ConfirmDelete
            isOpen={showDelete}
            onDelete={handleDeleteConfirm}
            onClose={handleDeleteCancel}
          />
        </div>
      )}
    </div>
  );
};

export default Calendar;

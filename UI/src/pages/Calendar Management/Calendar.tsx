// Calendar.tsx
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule"; // ✅ Import rrule plugin

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
    const result =
      isEdit && calId && parseInt(calId.toString()) !== 0
        ? await UpdateCalendarEventQuery(formData)
        : await CreateCalendarEventQuery(formData);

    if (result.isSuccess) {
      toast.success(result.message);
    } else {
      toast.warning(result.message);
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
    const result = await DeleteCalendarEventQuery(deleteId);
    setShowDelete(false);
    setDeleteId(null);
    setShowModal(false);
    setSelectedEvent(null);
    if (result.isSuccess) {
      toast.success(result.message);
    } else {
      toast.warning(result.message);
    }
    refetch();
  };

  const handleDeleteCancel = () => {
    setShowDelete(false);
    setDeleteId(null);
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
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
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              rrulePlugin,
            ]} // ✅ Corrected here
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            eventDrop={handleEventDrop}
            events={(data?.data ?? []).map((item) => {
              const isBirthday = item.title.toLowerCase() === "birthday";

              const fixedStart =
                item.start.replace(" ", "T").split(".")[0] + "Z";

              const startDate = new Date(fixedStart);
              const month = startDate.getMonth() + 1;
              const day = startDate.getDate();

              if (isBirthday) {
                return {
                  id: item.calId?.toString() ?? "",
                  title: item.title,
                  rrule: {
                    freq: "yearly",
                    dtstart: fixedStart,
                    bymonth: month,
                    bymonthday: day,
                  },
                  backgroundColor: "rgb(202,194,255)",
                  borderColor: "rgb(202,194,255)",
                  textColor: "#000000",
                };
              }

              return {
                id: item.calId?.toString() ?? "",
                title: item.title,
                start: fixedStart,
                end: item.end
                  ? item.end.replace(" ", "T").split(".")[0] + "Z"
                  : undefined,
                backgroundColor: "rgb(202,194,255)",
                borderColor: "rgb(202,194,255)",
                textColor: "#000000",
              };
            })}
            editable={true}
            selectable={true}
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

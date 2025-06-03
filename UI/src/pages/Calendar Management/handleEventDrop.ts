import { toast } from "react-toastify";
import { UpdateCalendarEventQuery } from "../../services/Calendar/UpdateCalendarEvent.query";

export interface EventDropInfo {
  event: {
    id: string;
    title: string;
    start: Date;
    end: Date | null;
    extendedProps: {
      description: string;
    };
  };
}

export const handleEventDrop = async (info: EventDropInfo) => {
  const updatedEvent = {
    calId: parseInt(info.event.id),
    title: info.event.title,
    start: info.event.start.toISOString(),
    end: info.event.end
      ? info.event.end.toISOString()
      : info.event.start.toISOString(), // fallback to start
    description: info.event.extendedProps.description,
  };

  const formData = new FormData();
  formData.append("calId", updatedEvent.calId.toString());
  formData.append("title", updatedEvent.title);
  formData.append("start", updatedEvent.start);
  formData.append("end", updatedEvent.end);
  formData.append("description", updatedEvent.description);

  const result = await UpdateCalendarEventQuery(formData);
  if (result.isSuccess) {
    toast.success(result.message);
  } else {
    toast.warning(result.message);
  }
};

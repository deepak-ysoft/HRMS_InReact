import React, { useEffect } from "react";
import { ICalendar } from "../../types/ICalendar.type";
import { useForm } from "react-hook-form";
import CustomInput from "../../components/FormFieldComponent/InputComponent";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { CalendarEventType } from "../../types/Enum/CalendarLeave";

interface EventModelProps {
  open: boolean;
  onClose: () => void;
  eventData?: ICalendar | null;
  onSave: (event: FormData) => void;
  onDelete: (id: number) => void;
  isEdit?: boolean;
}

const defaultValues: Partial<ICalendar> = {
  calId: 0,
  title: undefined,
  description: "",
  start: "",
  end: "",
};

export const EventModel: React.FC<EventModelProps> = ({
  open,
  onClose,
  eventData,
  onSave,
  onDelete,
  isEdit = false,
}) => {
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ICalendar>({ defaultValues });

  useEffect(() => {
    if (eventData) {
      Object.entries(eventData).forEach(([key, value]) => {
        setValue(key as keyof ICalendar, value as never);
      });
    } else {
      reset(defaultValues);
    }
  }, [eventData, setValue, reset]);

  const handleFormSubmit = (data: ICalendar) => {
    //  const validationErrors = validateForm(data);
    //  if (Object.keys(validationErrors).length > 0) {
    //    Object.entries(validationErrors).forEach(([key, message]) => {
    //      setError(key as string, { type: "manual", message: message as string });
    //    });
    //    return;
    //  }
    if (new Date(data.start) > new Date(data.end)) {
      alert("Start date cannot be after end date.");
      return;
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-opacity-40 flex justify-center z-50">
      <div className=" bg-base-100 rounded-lg shadow-lg border p-6 min-w-[500px]">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Event Details" : "Add Event"}
        </h2>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="">
          <input name="calId" type="hidden" value={watch("calId") || 0} />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 ">
            <CustomInput
              label="Title"
              name="title"
              type="select"
              value={watch("title") || ""}
              onChange={(e) =>
                setValue("title", String(Number(e.target.value)))
              }
              options={Object.values(CalendarEventType)
                .filter((value) => typeof value === "number")
                .map((value) => ({
                  label: CalendarEventType[value as number],
                  value: String(value),
                }))}
              error={errors.title?.message?.toString()}
              required
              disabled={!isEdit && !!eventData}
            />
            <CustomInput
              label="Start Date"
              name="start"
              type="datetime-local"
              value={watch("start") || ""}
              onChange={(e) => setValue("start", e.target.value)}
              error={errors.start?.message?.toString()}
              required
              disabled={!isEdit && !!eventData}
            />
            <CustomInput
              label="End Date"
              name="end"
              type="datetime-local"
              value={watch("end") || ""}
              onChange={(e) => setValue("end", e.target.value)}
              error={errors.end?.message?.toString()}
              required
              disabled={!isEdit && !!eventData}
            />{" "}
            <CustomInput
              label="Description"
              name="description"
              type="textarea"
              value={watch("description") || ""}
              onChange={(e) => setValue("description", e.target.value)}
              error={errors.description?.message?.toString()}
              rows={5}
              required
              disabled={!isEdit && !!eventData}
            />
          </div>
          <div className="flex gap-2 mt-6 justify-end">
            {isEdit && eventData && (
              <Button
                type="button"
                text="Delete"
                className="bg-[rgb(222,102,102)] text-white"
                onClick={() => onDelete(eventData?.calId ?? 0)}
              />
            )}
            <Button
              type="submit"
              text={isEdit ? "Update" : "Add"}
              className="bg-[rgb(66,42,213)] text-white"
              disabled={isSubmitting}
            />
            <Button
              type="button"
              text="Cancel"
              className="bg-gray-400 text-white"
              onClick={onClose}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

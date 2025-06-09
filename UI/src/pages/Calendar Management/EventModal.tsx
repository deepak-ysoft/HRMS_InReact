import React, { useEffect } from "react";
import { ICalendar } from "../../types/ICalendar.type";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ButtonComponent/ButtonComponent";
import { CalendarEventType } from "../../types/Enum/CalendarLeave";
import { FormField } from "../../components/FormFieldComponent/FormFieldComponent";

interface EventModelProps {
  open: boolean;
  onClose: () => void;
  eventData?: ICalendar | null;
  onSave: (event: FormData) => void;
  onDelete: (id: number) => void;
  isEdit?: boolean;
  disabled?: boolean;
  isFromEvent?: boolean;
}

const defaultValues: Partial<ICalendar> = {
  calId: 0,
  title: "",
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
  disabled = false,
  isFromEvent = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ICalendar>({ defaultValues });

  useEffect(() => {
    if (eventData) {
      console.log(eventData.title);
      Object.entries(eventData).forEach(([key, value]) => {
        setValue(key as string, value as never);
      });
    } else {
      reset(defaultValues);
    }
  }, [eventData, setValue, reset]);

  const handleFormSubmit = (data: ICalendar) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    onSave(formData);
  };

  if (!open) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-opacity-40 flex justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-lg border p-6 min-w-[500px]">
        <h2 className="text-xl font-semibold mb-4">
          {isEdit
            ? "Edit Event"
            : !isEdit && !isFromEvent
            ? "Add Event"
            : "Event Details"}
        </h2>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          encType="multipart/form-data"
        >
          <input type="hidden" {...register("calId")} />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {!isFromEvent && (
              <FormField
                type="select"
                name="title"
                label="Event Title"
                register={register}
                registerOptions={{ required: "Event title is required" }}
                error={errors.title}
                options={Object.values(CalendarEventType)
                  .filter((v) => typeof v === "number")
                  .map((value) => ({
                    value,
                    label: CalendarEventType[value as number],
                  }))}
                disabled={disabled}
              />
            )}

            <FormField
              type="datetime-local"
              name="start"
              label="Start Date"
              placeholder="Enter start date"
              register={register}
              registerOptions={{ required: "Start date is required" }}
              error={errors.start}
              disabled={disabled}
            />
            <FormField
              type="datetime-local"
              name="end"
              label="End Date"
              placeholder="Enter end date"
              register={register}
              registerOptions={{ required: "End date is required" }}
              error={errors.end}
              disabled={disabled}
            />
            <FormField
              type="textarea"
              name="description"
              label="Description"
              placeholder="Enter description"
              register={register}
              registerOptions={{
                required: "Description is required",
                maxLength: {
                  value: 10,
                  message: "Description cannot exceed 10 characters",
                },
              }}
              error={errors.description}
              disabled={disabled}
            />
          </div>

          <div className="flex gap-2 mt-6 justify-end">
            {isEdit && eventData && eventData?.title != "0" && !isFromEvent && (
              <Button
                type="button"
                text="Delete"
                className="bg-[rgb(222,102,102)] text-white"
                onClick={() => onDelete(eventData?.calId ?? 0)}
              />
            )}
            {eventData?.title != "0" && (
              <Button
                type="submit"
                text={isEdit ? "Update" : "Add"}
                className="bg-[rgb(66,42,213)] text-white"
              />
            )}

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

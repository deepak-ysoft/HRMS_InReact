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
      Object.entries(eventData).forEach(([key, value]) => {
        setValue(key as keyof ICalendar, value as never);
      });
    } else {
      reset(defaultValues);
    }
  }, [eventData, setValue, reset]);

  const handleFormSubmit = (data: ICalendar) => {
    console.log(errors.description?.message);
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
          {isEdit ? "Event Details" : "Add Event"}
        </h2>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          encType="multipart/form-data"
        >
          <input type="hidden" {...register("calId")} />
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
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
            />

            <FormField
              type="text"
              name="start"
              label="Start Date"
              placeholder="Enter start date"
              register={register}
              registerOptions={{ required: "Start date is required" }}
              error={errors.start}
            />
            <FormField
              type="text"
              name="end"
              label="End Date"
              placeholder="Enter end date"
              register={register}
              registerOptions={{ required: "End date is required" }}
              error={errors.end}
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

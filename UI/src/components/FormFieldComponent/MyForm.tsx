import { useForm } from "react-hook-form";
import { FormField } from "./FormFieldComponent";

enum CalendarEventType {
  Meeting = 1,
  Webinar,
  Workshop,
}

type FormValues = {
  photo: File | null;
  title: string;
  description: string;
  location: string;
};

export const MyForm = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  return (
    <form>
      <FormField
        type="file"
        name="photo"
        label="Upload Photo"
        setValue={setValue}
        registerOptions={{ required: "Photo is required" }}
        error={errors.photo}
      />

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
        type="textarea"
        name="description"
        label="Description"
        placeholder="Enter description"
        register={register}
        registerOptions={{ required: "Description is required" }}
        error={errors.description}
      />

      <FormField
        type="text"
        name="location"
        label="Location"
        placeholder="Enter location"
        register={register}
        registerOptions={{ required: "Location is required" }}
        error={errors.location}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

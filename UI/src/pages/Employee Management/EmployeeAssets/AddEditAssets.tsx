import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { AddEditAssets } from "../../../services/Employee Management/EmployeeAssets/AddUpdateAssets.query";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";
import { EmployeeAsset } from "../../../types/IEmployeeAsset.types";
import { toast } from "react-toastify";

const defaultValues: Partial<EmployeeAsset> = {
  assetId: 0,
  assetName: "",
  description: "",
  imagePath: "",
  image: null,
  empId: 0,
};

export const AssetsForm = ({
  editData,
  onClose,
  onSubmitSuccess,
}: {
  editData?: Partial<EmployeeAsset> | null;
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}) => {
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    watch,
    register,
  } = useForm<EmployeeAsset>({ defaultValues });

  const apiPath = import.meta.env.VITE_API_BASE_URL;
  const [previewImage, setPreviewImage] = useState<string>(
    apiPath + (editData?.imagePath || "") ||
      "https://i.pinimg.com/236x/49/93/64/4993642c65077a0e051623e94ade6b3a.jpg"
  );
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (editData) {
      Object.entries(editData).forEach(([key, value]) => {
        setValue(key as keyof EmployeeAsset, value as never);
      });
      setPreviewImage(
        editData.imagePath && editData.imagePath !== ""
          ? apiPath + editData.imagePath
          : "https://i.pinimg.com/236x/49/93/64/4993642c65077a0e051623e94ade6b3a.jpg"
      );
    } else {
      reset(defaultValues);
      setPreviewImage(
        "https://i.pinimg.com/236x/49/93/64/4993642c65077a0e051623e94ade6b3a.jpg"
      );
    }
  }, [editData, setValue, reset, apiPath]);

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const { mutate: submitAsset } = useMutation({
    mutationFn: (formData: FormData) => AddEditAssets(formData),
    onSuccess: (data) => {
      if (data.isSuccess) toast.success(data.message);
      else toast.warning(data.message);
      reset(defaultValues);
      if (onSubmitSuccess) onSubmitSuccess();
      if (onClose) onClose();
    },
    onError: () => {},
  });

  const onSubmit = (data: EmployeeAsset) => {
    const userId = localStorage.getItem("UserId");
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "assetId") {
          formData.append(key, data.assetId ? String(data.assetId) : "0");
        } else if (key === "empId") {
          formData.append(key, userId?.toString() || "0");
        } else if (key === "image" && value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    submitAsset(formData);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="bg-base-100 p-8 mt-12 rounded-lg shadow-md min-h-[78vh]"
      >
        <div className="w-full max-w-2xl pb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {editData ? "Edit" : "Add"} Asset
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8">
          <input name="assetId" type="hidden" value={watch("assetId") || 0} />
          <input name="empId" type="hidden" value={watch("empId") || 0} />

          <div className="avatar flex justify-center">
            <div
              className="w-52 rounded-full overflow-hidden cursor-pointer"
              onClick={handleImageClick}
            >
              <img
                src={previewImage}
                alt="Asset Preview"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          <input
            type="file"
            ref={imageInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          <FormField
            type="text"
            name="assetName"
            label="Asset Name"
            placeholder="Enter asset name"
            register={register}
            registerOptions={{ required: "Asset Name is required" }}
            error={errors.assetName}
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
        </div>{" "}
        <div className="flex">
          <Button
            type="submit"
            text={isSubmitting ? "Submitting..." : "Submit"}
            className="bg-[rgb(66,42,213)] text-white mt-10 py-2 px-4 rounded disabled:opacity-50"
            disabled={isSubmitting}
          />
          <Button
            type="button"
            text="Reset"
            onClick={() => reset(defaultValues)}
            className="bg-gray-500 text-white mt-10 py-2 px-4 rounded ml-4"
          />
        </div>
      </form>
    </>
  );
};

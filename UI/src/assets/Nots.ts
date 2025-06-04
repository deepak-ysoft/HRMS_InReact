// Main color - rgb(66,42,213)
// mid color - rgb(159,145,251)
// Light color - rgb(202,194,255)
// Extra light color - rgb(243,241,253)
// Red color - rgb(222,102,102)

// <input
//   type="file"
//   name="photo"
//   onChange={(e) => {
//     const file = (e.target as HTMLInputElement).files?.[0] || null;
//     setValue("photo", file);
//   }}
// />;
// {
//   errors.photo && <p>{errors.photo.message}</p>;
// }

// <select
//   {...register("title", {
//     required: "Event title is required",
//   })}
// >
//   <option value="">Select Event Title</option>
//   {Object.values(CalendarEventType)
//     .filter((value) => typeof value === "number")
//     .map((value) => (
//       <option key={value} value={value}>
//         {CalendarEventType[value]}
//       </option>
//     ))}
// </select>;
// {
//   errors.title && <p>{errors.title.message}</p>;
// }

// <textarea
//   placeholder="Description"
//   {...register("description", {
//     required: "description is a required",
//   })}
// />;
// {
//   errors.description && <p>{errors.description.message}</p>;
// }
// <input
//   type="text"
//   {...register("location", { required: "Location is required" })}
// />;
// {
//   errors.location && <p>{errors.location.message}</p>;
// }

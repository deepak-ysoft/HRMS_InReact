import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField } from "../../../components/FormFieldComponent/FormFieldComponent";
import { CreateReviewQuery } from "../../../services/Employee Management/PerformanceReview/CreateReview.query";
import { GetReviewsQuery } from "../../../services/Employee Management/PerformanceReview/GetReviews.query";
import { toast } from "react-toastify";
import { Button } from "../../../components/ButtonComponent/ButtonComponent";

interface CreateReviewRequestVM {
  employeeId: string;
  reviewerId: string;
  period: string;
  rating: number;
  comments: string;
}

interface PerformanceReviewResponseVM {
  id: number;
  employeeId: number;
  reviewerId: number;
  period: string;
  rating: number;
  comments: string;
  reviewDate: string;
}

interface ReviewSearchInputs {
  employeeId: string;
}

const PerformanceReviewManagement: React.FC = () => {
  const [reviews, setReviews] = useState<PerformanceReviewResponseVM[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(false);
  const [creatingReview, setCreatingReview] = useState<boolean>(false);

  // Form for creating a new review
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateReviewRequestVM>({
    defaultValues: {
      employeeId: "",
      reviewerId: "",
      period: `Q${Math.ceil(
        (new Date().getMonth() + 1) / 3
      )} ${new Date().getFullYear()}`,
      rating: 3,
      comments: "",
    },
  });

  // Form for searching reviews
  const {
    register: registerSearch,
    handleSubmit: handleSearchSubmit,
    watch: watchSearch,
    formState: { errors: searchErrors },
  } = useForm<ReviewSearchInputs>();
  const watchedSearchEmployeeId = watchSearch("employeeId");

  // Create Review Handler
  const onCreateReviewSubmit = async (data: CreateReviewRequestVM) => {
    setCreatingReview(true);

    const numericEmployeeId = parseInt(data.employeeId);
    const numericReviewerId = parseInt(data.reviewerId);

    if (isNaN(numericEmployeeId) || isNaN(numericReviewerId)) {
      toast.error("Employee ID and Reviewer ID must be valid numbers.");
      setCreatingReview(false);
      return;
    }

    const formData = new FormData();
    formData.append("employeeId", numericEmployeeId.toString());
    formData.append("reviewerId", numericReviewerId.toString());
    formData.append("period", data.period);
    formData.append("rating", data.rating.toString());
    formData.append("comments", data.comments);

    await CreateReviewQuery(formData);

    toast.success(
      `Review for Employee ID ${numericEmployeeId} created successfully!`
    );
    resetCreate();

    // Optionally, refresh the review list for the relevant employee
    if (numericEmployeeId === parseInt(watchedSearchEmployeeId)) {
      fetchReviewsForEmployee(numericEmployeeId);
    }
  };

  // Fetch reviews for a given employee
  const fetchReviewsForEmployee = async (employeeId: number) => {
    setLoadingReviews(true);
    const data = await GetReviewsQuery(employeeId);
    setReviews(data);
    if (data.length > 0) {
      toast.success(`Reviews loaded for employee ID: ${employeeId}`);
    } else {
      toast.info(`No reviews found for employee ID: ${employeeId}`);
    }
  };

  // Handler for search form submission
  const onSearchReviewsSubmit = (data: ReviewSearchInputs) => {
    const empId = parseInt(data.employeeId);
    if (isNaN(empId)) {
      toast.error(
        "Please enter a valid numeric Employee ID to search reviews."
      );
      return;
    }
    fetchReviewsForEmployee(empId);
  };

  return (
    <div className="min-h-screen bg-base-200 p-4 font-inter">
      <div className="card w-full max-w-5xl mx-auto shadow-2xl bg-base-100 p-8 rounded-box">
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Performance Review Management
        </h2>

        {/* Create New Review Form */}
        <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-secondary mb-4">
            Create New Performance Review
          </h3>
          <form
            onSubmit={handleCreateSubmit(onCreateReviewSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                type="text"
                name="employeeId"
                label="Employee ID (Reviewee)"
                placeholder="e.g., 101"
                register={registerCreate}
                registerOptions={{
                  required: "Employee ID is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Employee ID must be numeric",
                  },
                }}
                error={createErrors.employeeId}
              />
              <FormField
                type="text"
                name="reviewerId"
                label="Reviewer ID"
                placeholder="e.g., 201"
                register={registerCreate}
                registerOptions={{
                  required: "Reviewer ID is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Reviewer ID must be numeric",
                  },
                }}
                error={createErrors.reviewerId}
              />
              <FormField
                type="text"
                name="period"
                label="Review Period"
                placeholder="e.g., Q1 2023, Annual 2022"
                register={registerCreate}
                registerOptions={{ required: "Review Period is required" }}
                error={createErrors.period}
              />
              <FormField
                type="number"
                name="rating"
                label="Rating (1-5)"
                placeholder="e.g., 4"
                register={registerCreate}
                registerOptions={{
                  required: "Rating is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Rating must be at least 1" },
                  max: { value: 5, message: "Rating cannot exceed 5" },
                }}
                error={createErrors.rating}
              />
            </div>
            <FormField
              type="textarea"
              name="comments"
              label="Comments"
              placeholder="Detailed comments about performance..."
              register={registerCreate}
              registerOptions={{
                required: "Comments are required",
                minLength: {
                  value: 20,
                  message: "Comments must be at least 20 characters",
                },
              }}
              error={createErrors.comments}
            />
            <div className="form-control mt-4">
              <Button
                type="submit"
                className="btn btn-primary rounded-md btn-block"
                disabled={creatingReview}
                text={creatingReview ? "Submitting..." : "Create Review"}
              />
            </div>
          </form>
        </div>

        {/* View Employee Reviews Section */}
        <div className="mb-8 p-6 bg-base-200 rounded-lg shadow-inner">
          <h3 className="text-2xl font-semibold text-secondary mb-4">
            View Employee Reviews
          </h3>
          <form
            onSubmit={handleSearchSubmit(onSearchReviewsSubmit)}
            className="form-control mb-4"
          >
            <FormField
              type="text"
              name="employeeId"
              label="Employee ID to view reviews"
              placeholder="e.g., 101"
              register={registerSearch}
              registerOptions={{
                required: "Employee ID is required to search reviews",
                pattern: {
                  value: /^\d+$/,
                  message: "Employee ID must be numeric",
                },
              }}
              error={searchErrors.employeeId}
            />
            <Button
              type="submit"
              className="btn btn-info rounded-md mt-2"
              disabled={
                loadingReviews ||
                !watchedSearchEmployeeId ||
                isNaN(parseInt(watchedSearchEmployeeId))
              }
              text={loadingReviews ? "Loading..." : "View Reviews"}
            />
          </form>
        </div>

        {/* Reviews Table */}
        {loadingReviews ? (
          <div className="flex justify-center items-center h-48">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : reviews.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="table w-full">
              <thead>
                <tr className="bg-primary text-primary-content">
                  <th>ID</th>
                  <th>Employee ID</th>
                  <th>Reviewer ID</th>
                  <th>Period</th>
                  <th>Rating</th>
                  <th>Comments</th>
                  <th>Review Date</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-base-200">
                    <td>{review.id}</td>
                    <td>{review.employeeId}</td>
                    <td>{review.reviewerId}</td>
                    <td>{review.period}</td>
                    <td>
                      <div className="rating rating-sm">
                        {[...Array(5)].map((_, i) => (
                          <input
                            key={i}
                            type="radio"
                            name={`rating-${review.id}`}
                            className="mask mask-star-2 bg-yellow-400"
                            checked={i + 1 === review.rating}
                            readOnly
                          />
                        ))}
                      </div>
                      <span className="ml-2">({review.rating}/5)</span>
                    </td>
                    <td className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                      {review.comments}
                    </td>
                    <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-lg text-gray-500 mt-8">
            No performance reviews found for the selected employee.
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceReviewManagement;

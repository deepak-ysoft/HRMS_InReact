interface toastTypes {
  toastMsg: string;
  ToastFor: string;
}

export const ToastMessage: React.FC<toastTypes> = ({ toastMsg, ToastFor }) => {
  return (
    <>
      <div
        className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow-lg transition-transform duration-500 ease-in-out
                  ${
                    ToastFor.includes("success") ? "bg-green-600" : "bg-red-600"
                  } text-white
                  animate-slide-in-fade-out`}
        style={{
          transform: toastMsg ? "translateY(0)" : "translateY(-40px)",
          opacity: toastMsg ? 1 : 0,
        }}
      >
        {toastMsg}
      </div>
    </>
  );
};

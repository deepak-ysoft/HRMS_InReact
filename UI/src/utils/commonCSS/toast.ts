// utils/toast.ts
import { toast, ToastOptions } from 'react-toastify';

// Common base Tailwind styles for all toasts
const baseToastStyle: ToastOptions = {
  className: 'text-sm font-medium rounded-md shadow-lg px-4 py-3 text-white',
  progressClassName: 'bg-white',
};

// Reusable toast functions
export const showToast = {
  success: (message: string): void => {
    toast.success(message, {
      ...baseToastStyle,
      className: `${baseToastStyle.className} bg-green-600`,
      // icon: '✅', // Use a React component or JSX element
    });
  },

  error: (message: string): void => {
    toast.error(message, {
      ...baseToastStyle,
      className: `${baseToastStyle.className} bg-red-600`,
      // icon: '❌', // Use a React component or JSX element
    });
  },

  warning: (message: string): void => {
    toast.warning(message, {
      ...baseToastStyle,
      className: `${baseToastStyle.className} bg-yellow-500 text-black`,
      // icon: '⚠️', // Use a React component or JSX element
    });
  },
};

import { toast, ToastOptions } from "react-toastify";

/**
 * Shows a success toast message
 * @param message - The message to display
 */
export const SuccesfulMessageToast = (message: string): void => {
    toast.success(message, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    } as ToastOptions);
};

/**
 * Shows an error toast message
 * @param message - The message to display
 */
export const ErrorMessageToast = (message: string): void => {
    toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    } as ToastOptions);
};

/**
 * Shows a warning toast message
 * @param message - The message to display
 */
export const WarningMessageToast = (message: string): void => {
    toast.warn(message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    } as ToastOptions);
};
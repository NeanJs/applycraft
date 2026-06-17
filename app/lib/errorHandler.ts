import toast from "react-hot-toast";

export function handleError(error: unknown, message: string) {
  console.error(error);
  toast.error(message ?? "Something went wrong. Please try again.");
}

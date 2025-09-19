import toast from "react-hot-toast";

/**
 * Centralized toast helpers for Overmind
 * so components can just call notify.success("...") etc.
 */
export const notify = {
  success: (msg) => toast.success(msg, { duration: 4000 }),
  error: (msg) => toast.error(msg, { duration: 4000 }),
  info: (msg) => toast(msg, { duration: 4000 }),
  loading: (msg) => toast.loading(msg),
};

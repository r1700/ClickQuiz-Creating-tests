import { useState } from "react";

export function useExamForm(initialValues) {
  const [form, setForm] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [guestWarning, setGuestWarning] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = (defaults) => {
    setForm(defaults);
    setMessage(null);
    setGuestWarning(false);
  };

  const clearMessage = () => {
    setMessage(null);
  };

  return {
    form,
    setForm,
    loading,
    setLoading,
    message,
    setMessage,
    guestWarning,
    setGuestWarning,
    handleChange,
    resetForm,
    clearMessage,
  };
}

export default useExamForm;

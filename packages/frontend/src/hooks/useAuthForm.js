import { useState } from "react";

export function useAuthForm({ initialValues, validate, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [globalError, setGlobalError] = useState(null);

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const resetState = () => {
    setErrors({});
    setGlobalError(null);
    setSuccess(null);
  };

  const submit = async (event) => {
    event?.preventDefault();
    resetState();

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(values);
    } catch (error) {
      setGlobalError(error?.message || "שגיאה בלתי צפויה");
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    errors,
    loading,
    success,
    globalError,
    setSuccess,
    setGlobalError,
    setErrors,
    handleChange,
    setValues,
    submit,
    resetState,
  };
}

export default useAuthForm;

export function extractErrorMessage(err: any, fallback?: string): string {
  const data = err.response?.data;

  console.log("extractErrorMessage", err?.response);

  // Case 1: { error: "Some string" }
  if (typeof data?.error === "string") return data.error;

  // Case 2: { message: "Some string" }
  if (typeof data?.message === "string") return data.message;

  // Case 3: { error: { "field": "msg", ... } } → extract first message
  if (data?.error && typeof data.error === "object") {
    const firstError = Object.values(data.error)[0];
    if (typeof firstError === "string") return firstError;
  }

  // Case 4: { errors: [ "msg1", "msg2" ] }
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    return data.errors[0];
  }

  // Fallback
  return fallback ?? "Something went wrong";
}

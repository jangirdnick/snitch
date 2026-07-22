import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

/**
 * Expected structure from the backend when a validation error occurs.
 */
export interface FieldErrorItem {
  field: string;
  message: string;
}

/**
 * Loops through the backend's structured fields array and registers each error
 * with React Hook Form using `setError`. Supports nested fields (e.g. `colors.0.sku`).
 *
 * @param fields Array of field error objects from the API.
 * @param setError The setError function returned by useForm().
 */
export function setFormErrors<T extends FieldValues>(
  fields: FieldErrorItem[],
  setError: UseFormSetError<T>,
): void {
  fields.forEach(({ field, message }) => {
    // Typecast to Path<T> since the backend paths represent the nested structure
    setError(field as Path<T>, {
      type: 'server',
      message,
    });
  });
}

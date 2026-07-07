type FieldError = {
  field: string;
  message: string;
};

type ApiError = {
  name: string;
  message: string;
  fields?: FieldError[];
};

export type ApiNormalResponse = {
  success: true;
  message: string;
};

export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiError;
};

export type ApiResponse = ApiNormalResponse | ApiErrorResponse;

import { ICustomError, IValidationErrorResponse } from '@/types/error';

export const fetcher = async (
  url: string,
  options: RequestInit = {
    method: 'GET',
  },
  needAuth = true,
  needJson = true
): Promise<
  { data: null; error: ICustomError } | { data: unknown; error: null }
> => {
  const API_URL =
    import.meta.env.MODE === 'development'
      ? import.meta.env.VITE_API_URL
      : '/api';

  const queryOptions: RequestInit = {
    credentials: needAuth ? 'include' : 'omit',
    headers: {
      ...options.headers,
    },
    ...options,
  };

  if (needJson) {
    queryOptions.headers = {
      ...queryOptions.headers,
      'Content-Type': 'application/json',
    };
  }

  const response = await fetch(`${API_URL}${url}`, queryOptions);
  let json;
  switch (response.status) {
    case 204:
      return { data: null, error: null };
    default:
      json = await response.json();
  }

  if (!response.ok) {
    switch (json.code) {
      case 'ACCESS_TOKEN_EXPIRED': {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!refreshResponse.ok) {
          const refreshJson = await refreshResponse.json();
          if (refreshJson.code === 433) {
            throw new Error('Refresh token is invalid');
          } else if (!refreshResponse.ok) {
            throw new Error(refreshJson);
          }
        }

        const retryResponse = await fetcher(url, options, needAuth, needJson);

        return retryResponse;
      }
      // errors: [{
      //   "type": "field",
      //   "value": "test",
      //   "msg": "Adresse email invalide.",
      //   "path": "email",
      //   "location": "body"
      // }]
      case 'VALIDATION_ERROR': {
        const errors: ICustomError['validationErrors'] = [];
        json.errors.forEach((error: IValidationErrorResponse) => {
          const existingError = errors.find((e) => e.path === error.path);

          if (existingError) {
            existingError.errors.push(error.msg);
          } else {
            errors.push({ path: error.path, errors: [error.msg] });
          }
        });

        console.log('errors', errors);

        return {
          data: null,
          error: {
            name: 'ValidationError',
            message: 'Les données envoyées ne sont pas correct',
            validationErrors: errors,
          },
        };
      }
      default: {
        throw new Error(json);
      }
    }
  }

  return json;
};

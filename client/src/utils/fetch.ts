export const fetcher = async (
  url: string,
  options: RequestInit = {
    method: "GET",
  },
  needAuth = true,
) => {
  const API_URL =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_API_URL
      : "/api";

  const queryOptions: RequestInit = {
    credentials: needAuth ? "include" : "omit",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
    ...options,
  };
  const response = await fetch(`${API_URL}${url}`, queryOptions);
  let json;
  switch (response.status) {
    case 204:
      return;
    default:
      json = await response.json();
  }

  if (!response.ok) {
    switch (json.code) {
      case 432: {
        const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
          method: "GET",
          credentials: "include",
        });

        if (!refreshResponse.ok) {
          const refreshJson = await refreshResponse.json();
          if (refreshJson.code === 433) {
            throw new Error("Refresh token is invalid");
          } else if (!refreshResponse.ok) {
            throw new Error(refreshJson);
          }
        }

        const retryResponse = await fetch(`${API_URL}${url}`, queryOptions);

        if (!retryResponse.ok) {
          throw new Error(json);
        }

        return await retryResponse.json();
      }
      case 422: {
        const errorMessage = json.errors
          .map((error: { msg: string }) => error.msg)
          .join("\n");
        throw new Error(errorMessage);
      }
      default: {
        throw new Error(json.message);
      }
    }
  }

  return json;
};

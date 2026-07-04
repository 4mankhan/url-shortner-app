let isRefreshing = false;
let refreshPromise = null;

async function refreshAccessToken() {
  const res = await fetch("/api/refresh", {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  return res;
}

export async function fetchWithAuth(url, options = {}, config = {}) {
  const { redirectOnFail = true } = config;

  const fetchOptions = {
    ...options,
    credentials: "include",
    headers: { ...options.headers },
  };

  let response = await fetch(url, fetchOptions);

  if (response.status !== 401) return response;

  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken()
      .catch((err) => {
        refreshPromise = null;
        throw err;
      })
      .finally(() => {
        isRefreshing = false;
      });
  }

  try {
    await refreshPromise;
  } catch {
    if (redirectOnFail) window.location.href = "/login";
    throw new Error("Session expired");
  }

  response = await fetch(url, fetchOptions);

  if (response.status === 401) {
    if (redirectOnFail) window.location.href = "/login";
    return response;
  }

  return response;
}

interface ApiRequestInterface {
  additionalUrl: string,
  method: string,
  doNotParse?: boolean,
  body?: any,
  auth?: string,
}

export const apiRequest = async (
  { additionalUrl, method, doNotParse, body, auth }: ApiRequestInterface,
) => {
  const req: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (auth)
    req.headers = { "Content-Type": "application/json", Authorization: auth };

  if (body) req.body = JSON.stringify(body);

  const url = import.meta.env.DEV
    ? `http://localhost:8080/${additionalUrl}`
    : import.meta.env.BASE_URL + "api/" + additionalUrl;

  const res = await fetch(url, req);

  if (doNotParse) return { ok: res.ok } as const

  const data = await res.json();

  return { ok: res.ok, data } as const;
};

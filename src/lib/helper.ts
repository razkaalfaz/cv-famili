export const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => res.json());

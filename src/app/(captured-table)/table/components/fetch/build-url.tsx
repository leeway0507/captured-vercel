export default function buildUrl<D extends object>(baseParam: string, searchParams: D) {
  const queryParam = new URLSearchParams();
  Object.entries(searchParams).map((k) => (queryParam.set(k[0], k[1])));

  return `${baseParam}?${queryParam.toString()}`;
}

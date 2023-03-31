export const filterObj = (
  x: {},
  filterFn: (key: string | number | symbol, value: any) => boolean
) => {
  const filteredEntries = Object.entries(x).filter(([k, v]) => filterFn(k, v));
  return Object.fromEntries(filteredEntries);
};

export const removeFunctionsFromObject = (o: {}) =>
  filterObj(o, (k, v) => typeof v !== "function");

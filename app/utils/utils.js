export const toTimestamp = (strDate) => {
  let date = Date.parse(strDate);

  return date / 1000;
}
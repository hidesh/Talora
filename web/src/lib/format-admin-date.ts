const monthNames = ["jan.", "feb.", "mar.", "apr.", "maj", "jun.", "jul.", "aug.", "sep.", "okt.", "nov.", "dec."];

const dateParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Copenhagen",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatAdminDate(value: string, style: "medium" | "short" = "medium") {
  const parts = dateParts.formatToParts(new Date(value));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  const day = String(Number(get("day")));
  const month = get("month");
  const year = get("year");
  const time = `${get("hour")}.${get("minute")}`;

  return style === "short"
    ? `${day}.${month}.${year} ${time}`
    : `${day}. ${monthNames[Number(month) - 1]} ${year} ${time}`;
}

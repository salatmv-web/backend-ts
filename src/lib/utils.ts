import { prayer } from "./prayer";

function convertTimestampToDate(timestamp: number): Date {
  const hours = Math.floor(timestamp / 60);
  const minutes = timestamp % 60;
  let date = new Date();
  void date.setHours(hours);
  void date.setMinutes(minutes);
  void date.setSeconds(0);
  return date;
}

function daysIntoYear(date: Date) {
  return (
    ((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(date.getFullYear(), 0, 0)) /
      24 /
      60 /
      60 /
      1000) %
    366
  );
}

function convertTimestampToString(timestamp: number): string {
  return [Math.floor(timestamp / 60), timestamp % 60]
    .map((i) => i.toString().padStart(2, "0"))
    .join(":");
}

function convertTZMaldives(date: Date | number = Date.now()): Date {
  return new Date(
    (typeof date === "number" ? new Date(date) : date).toLocaleString("en-US", {
      timeZone: "Asia/Karachi",
    })
  );
}

function getIslandToDefault(name?: string) {
  return prayer.getIsland(name) ?? prayer.getIsland("102")!;
}

export {
  convertTimestampToDate,
  convertTimestampToString,
  daysIntoYear,
  convertTZMaldives,
  getIslandToDefault,
};

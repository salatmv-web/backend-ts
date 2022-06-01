import type { Atoll } from "#interfaces/atoll";
import type { Island } from "#interfaces/island";
import type { PrayerTimes } from "#interfaces/prayer";
import { readFileSync } from "fs";
import { join } from "path";
import { assetsFolder } from "./constants";

function inferType(value: string): number | string {
  if (!isNaN(parseInt(value))) return parseInt(value);
  else return value;
}

function convertCSVToJSON<T extends any>(
  filepath: string,
  delimiter: string = "	",
  headers: string[] = []
): T[] {
  const raw = readFileSync(filepath, { encoding: "utf16le", flag: "r" });

  const lines = raw.split("\n").map((r) => r.replace(/\r/g, ""));

  const results: T[] = [];

  lines.forEach(
    (l) =>
      void results.push(
        headers.reduce(
          (obj: { [x: string]: string | number }, header, index) => {
            obj[header] = inferType(l.split(delimiter)[index]);
            return obj;
          },
          {}
        ) as T
      )
  );

  return results;
}

const islands = convertCSVToJSON<Island>(
  join(assetsFolder, "islands.csv"),
  undefined,
  [
    "categoryId",
    "islandId",
    "atoll",
    "englishName",
    "dhivehiName",
    "arabicName",
    "offset",
    "latitude",
    "longitude",
    "status",
  ]
);

const entries = convertCSVToJSON<PrayerTimes>(
  join(assetsFolder, "prayertimes.csv"),
  undefined,
  ["categoryId", "date", "fajr", "sunrise", "duhr", "asr", "maghrib", "isha"]
);

const atolls = convertCSVToJSON<Atoll>(
  join(assetsFolder, "atolls.csv"),
  undefined,
  ["atollId", "name", "arabicName", "dhivehiName"]
);

export { convertCSVToJSON, islands, entries, atolls };

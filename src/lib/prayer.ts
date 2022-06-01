// import type { Island, PrayerTimes } from "@prisma/client";
import type { Island } from "#interfaces/island";
import type { PrayerTimes } from "#interfaces/prayer";
import { atolls, entries, islands } from "./csv";
// import { island, prayerTimes } from "./db";
import {
  convertTimestampToDate,
  convertTimestampToString,
  convertTZMaldives,
  daysIntoYear,
} from "./utils";

const timings: TimingsType[] = [
  "fajr",
  "sunrise",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
];

export class Prayer {
  // private cache: Map<string, PrayerTimes[] | Island[]> = new Map();

  public async init() {
    // void this.cache.set("entries", await prayerTimes.findMany());
    // void this.cache.set("islands", await island.findMany());
    // void this.cache.set("entries", entries);
    // void this.cache.set("islands", islands);
  }

  public getAtoll(query?: string | number) {
    const atoll = atolls.find((a) => a.atollId === query || a.name === query);
    return atoll ?? null;
  }

  public getIsland(query?: string | number) {
    const island =
      (islands as Island[]).find(
        (i) => i.islandId == query || i.islandId.toString() == query?.toString()
        // `${i.atoll}${i.englishName}` === query?.toString().replace(/\s/g, "")
      ) ?? null;

    return island;
  }

  public getToday(island: Island) {
    return this.getEntryFromDay(daysIntoYear(new Date()), island);
  }

  public getTodayDetailed(island: Island) {
    const data = this.getToday(island);

    if (!data) return null;

    return this.iterateObjectToFormat(data);
  }

  public getNextPrayer(island: Island) {
    let timestamps = this.getToday(island);

    if (!timestamps) return null;

    const now = convertTZMaldives();

    let call: TimingsType = timings.find(
      (call) => convertTimestampToDate(timestamps![call]) > now
    ) as TimingsType;

    if (!call) {
      call = "fajr";
      timestamps = this.getEntryFromDay(
        (daysIntoYear(convertTZMaldives()) + 1) % 366,
        island
      );
    }

    return {
      call,
      date: convertTimestampToDate(timestamps![call]),
      string: convertTimestampToString(timestamps![call]),
    } as DetailedTimestamp;
  }

  public getPrayerByDate(island: Island, date: number) {
    if (!date) return null;

    const data = this.getEntryFromDay(daysIntoYear(new Date(date)), island);

    if (!data) return null;

    return this.iterateObjectToFormat(data);
  }

  private getEntryFromDay(day: number, island: Island): PrayerTimes | null {
    return (
      (entries! as PrayerTimes[]).find(
        (en) => en.date === day && en.categoryId === island.categoryId
      ) ?? null
    );
  }

  private iterateObjectToFormat(_data: PrayerTimes) {
    if (!_data) return null;

    const data = { ..._data };

    const obj: { [k: string]: DetailedTimestamp | number | Date } = {
      categoryId: data.categoryId,
      date: convertTimestampToDate(data.date),
    };

    void delete (data as Partial<PrayerTimes>).categoryId;
    void delete (data as Partial<PrayerTimes>).date;

    for (const key of Reflect.ownKeys(data)) {
      obj[key as string] = {
        date: convertTimestampToDate(data[key as TimingsType]),
        string: convertTimestampToString(data[key as TimingsType]),
      };
    }

    return { ...obj };
  }
}

interface DetailedTimestamp {
  date: Date | number;
  string: string;
}

type TimingsType = keyof PrayerTimes;

export const prayer = new Prayer();

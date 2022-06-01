export type Island = {
  categoryId: number;
  islandId: number;
  atoll: number;
  englishName: string;
  dhivehiName: string;
  arabicName: string;
  offset: number;
  latitude: number | null;
  longitude: number | null;
  status: 0 | 1;
};

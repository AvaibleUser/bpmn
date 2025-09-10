export type SideType = 'A' | 'B';

export interface Song {
  id: number;
  discographyId: number;
  name: string;
  side?: SideType;
}

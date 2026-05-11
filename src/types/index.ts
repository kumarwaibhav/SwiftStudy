export type VideoType = 'concept' | 'lecture' | 'implementation' | 'visualization';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Video {
  title: string;
  channel: string;
  url: string;
  type: VideoType;
  difficulty: Difficulty;
  why_useful: string;
}

export interface SearchResult {
  topic: string;
  unit: string;
  videos: Video[];
  study_tip: string;
}

export interface UnitData {
  title: string;
  icon: string;
  accent: string;
  glow: string;
  topics: string[];
}

export type UnitMap = Record<number, UnitData>;

export type Area = 'Matemática' | 'Humanas' | 'Linguagens' | 'Natureza' | 'TDES';
export type ContentType = 'image' | 'video' | 'docs' | 'canva' | 'code' | 'other';
export type OriginTag = 'Indicada pelo professor' | 'Escolha do estudante';

export interface Activity {
  id?: string;
  title: string;
  trimester: number;
  description: string;
  contentUrl: string;
  contentType: ContentType;
  originTag: OriginTag;
  area: Area;
  createdAt?: any;
}

export interface Profile {
  name: string;
  age: number;
  city: string;
  personality: string;
  bio: string;
  goals: string;
  professionalGoals: string;
  hobbies: string[];
}

export interface GalleryImage {
  id?: string;
  url: string;
  description: string;
  createdAt?: any;
}

export type Album = {
  id: number;
  title: string;
  duration: string;
  coverImage: string;
  genre: string;
  releaseDate: string;
  artist: Singer;
};

export type Singer = {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
  type: string;
  location: string;
};

export type Song = {
  id: string;
  title: string;
  duration: string;
  album: Album;
  singer: Singer;
  filePath: string;
  isLiked: boolean;
};

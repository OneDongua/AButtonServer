export interface Post {
  location: Location;
  title: string;
  disability: string[];
  count: number;
  mod_time: number;
}

export interface Posts {
  [time: number]: Post;
}

export interface Detail {
  author_id: number;
  title: string;
  content: string;
  disability: string[];
  comment: Comment[];
  image_count: number;
  location: Location;
}

export interface Comment {
  author_id: number;
  content: string;
  time: number;
  likes: number;
  dislikes: number;
}

export interface NewPost {
  location: Location;
  title: string;
  content: string;
  disability: string[];
  author_id: number;
  image_count: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  altitude: number;
}

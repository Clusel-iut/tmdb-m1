import {User} from "firebase";
import {MovieResponse} from "./Movie";

export interface ListeResponse {
  id: number;
  user: User;
  name: string;
  movies: MovieResponse[];
}

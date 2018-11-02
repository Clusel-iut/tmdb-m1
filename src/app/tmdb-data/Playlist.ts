export class Playlist {
  name: string;
  films: string[];

  constructor(name: string, films: string[] = null) {
    this.name = name;
    if (films != null) {
      this.films = films;
    }
  }
}

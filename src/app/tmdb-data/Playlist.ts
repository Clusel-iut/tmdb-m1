class Playlist {
  name: string;
  films: string[];

  constructor(name: string) {
    this.name = name;
  }

  public addFilm(idFilm: string) {
    this.films.push(idFilm);
  }
}

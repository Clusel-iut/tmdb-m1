import {Component, Input, OnInit} from '@angular/core';
import {TrendingResult} from '../tmdb-data/Trending';
import {TmdbService} from '../tmdb.service';
import {MovieResponse} from '../tmdb-data/Movie';
import {CreditsResult} from '../tmdb-data/MovieCredits';
import {PlaylistService} from "../playlist.service";
@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.css']
})

export class ListMoviesComponent implements OnInit {

  @Input('trendings') private _trendings: TrendingResult;
  @Input('start') private _start: number;
  @Input('end') private _end: number;
  @Input() private _playlist: boolean;
  @Input() private _list: any;

  private _openMovie: boolean;
  private _movie: MovieResponse;
  private _credits: CreditsResult;
  constructor (private tmdb: TmdbService, private playlistSvc: PlaylistService) {
    this._openMovie = false;
  }

  get trendings(): TrendingResult {
    return this._trendings;
  }

  getPath(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  ngOnInit() {
  }

  get openMove(): boolean {
    return this._openMovie;
  }
  openMovie(elem: any) {
    let movie: boolean;
    setTimeout( () =>
        this.tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
          .getMovie(elem.id)
          .then( (m: MovieResponse) => {
            console.log( this._movie = m);
            if (m.title === elem.title) {
              this._openMovie = true;
            }
          } )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
    setTimeout( () =>
        this.tmdb.getCredits(elem.id)
          .then( (c: CreditsResult) => {
            this._credits = c;
          } )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
  }

  get movie(): MovieResponse {
    return this._movie;
  }

  get credits(): CreditsResult {
    return this._credits;
  }

  closeMovie() {
    this._openMovie = false;
  }

  get start(): number {
    return this._start;
  }

  get end(): number {
    return this._end;
  }

  get playlist(): boolean {
    return this._playlist;
  }

  supprimerMoviePlaylist(id: string) {
    this.playlistSvc.supprimerListeFilm(this._list, id);
  }
}

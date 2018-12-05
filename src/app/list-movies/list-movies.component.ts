import {Component, Input, OnInit} from '@angular/core';
import {TrendingDetails, TrendingResult} from '../tmdb-data/Trending';
import {TmdbService} from '../tmdb.service';
import {MovieResponse} from '../tmdb-data/Movie';
import {CreditsResult} from '../tmdb-data/MovieCredits';
import {PlaylistService} from '../playlist.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PopupComponent } from '../popup/popup.component';

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
  private _estFavoris: boolean;

  constructor (private tmdb: TmdbService, private playlistSvc: PlaylistService, public dialog: MatDialog) {
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
    setTimeout( () =>
        this.tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
          .getMovie(elem.id)
          .then( (m: MovieResponse) => {
            console.log( this._movie = m);
            if (m.title === elem.title) {
              this._openMovie = true;
            }
            this._movie.estFavoris = this.playlistSvc.estFavoris(elem.id);
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

  get estFavoris(): boolean {
    return this._estFavoris;
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

  supprimerMoviePlaylist(nameMovie: string, filmId: string) {
    this.playlistSvc.supprimerFilmListe(this._list, filmId);
    let index = -1;
    this._trendings.results.forEach(value => {
      if (value.id === Number(filmId)) {
        index = this._trendings.results.indexOf(value);
      }
    });
    if (index !== -1) {
      this._trendings.results.splice(index);
    }
    this.openModal(nameMovie, false);
  }

  openModal(name: string, Ajoute: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: name,
      estAjoute: Ajoute
    };
    const dialogRef = this.dialog.open(PopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed');
      console.log(result);
    });
  }
}

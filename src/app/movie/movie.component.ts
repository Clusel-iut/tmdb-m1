import {Component, Input, OnInit} from '@angular/core';
import {MovieResponse} from '../tmdb-data/Movie';
import {CreditsResult} from '../tmdb-data/MovieCredits';
import {UserComponent} from '../user/user.component';
import {PlaylistService} from '../playlist.service';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter} from 'rxjs/internal/operators';
import {User} from 'firebase';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit {

  @Input() private _movie: MovieResponse;
  @Input() private _credits: CreditsResult;
  private _switchPlaylists: boolean;
  private _user: User;

  constructor(private playlistSvc: PlaylistService,  public anAuth: AngularFireAuth) {
    this._switchPlaylists = true;
    this.anAuth.user.pipe(filter( u => !!u )).subscribe( u => {
      this._user = u;
    });
  }

  get movie(): MovieResponse {
    return this._movie;
  }

  getPath(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  ngOnInit() {
  }

  get credits(): CreditsResult {
    return this._credits;
  }

  get open(): boolean {
    return this._switchPlaylists;
  }

  switch() {
    this._switchPlaylists = !this._switchPlaylists;
  }

  public ajouterFilmListe(list: any, filmId: string) {
    this._switchPlaylists = !this._switchPlaylists;
    this.playlistSvc.ajouterFilmListe(list, filmId);
  }

  get listes(): Observable<any> {
    return this.playlistSvc.listes;
  }

  public estFavoris(idFilm: string): boolean {
    return true;

    // return this.playlistSvc.estFavoris(idFilm);
  }

  public ajouterFavoris(idFilm: string) {
    this.playlistSvc.ajouterFavoris(idFilm);
    this._switchPlaylists = !this._switchPlaylists;
  }

  public suprimerFavoris(idFilm: string) {
    this.playlistSvc.suprimerFavoris(idFilm);
  }

  get user(): User {
    return this._user;
  }
}

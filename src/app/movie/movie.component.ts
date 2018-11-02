import {Component, Input, OnInit} from '@angular/core';
import {MovieResponse} from '../tmdb-data/Movie';
import {CreditsResult} from '../tmdb-data/MovieCredits';
import {UserComponent} from '../user/user.component';
import {PlaylistService} from '../playlist.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit {

  @Input() private _movie: MovieResponse;
  @Input() private _credits: CreditsResult;
  private _switchPlaylists: boolean;
  private _switchDropdown: boolean;

  constructor(private playlistSvc: PlaylistService) {
    this._switchPlaylists = true;
    this._switchDropdown = false;
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
    this.playlistSvc.ajouterFilmListe(list, filmId);
  }

  get listes(): Observable<any> {
    return this.playlistSvc.listes;
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {MovieResponse} from '../tmdb-data/Movie';
import {CreditsResult} from '../tmdb-data/MovieCredits';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit {

  @Input() private _movie: MovieResponse;
  @Input() private _credits: CreditsResult;
  private _switchPlaylists: boolean;

  constructor() {
    this._switchPlaylists = true;
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

  switchPlaylists() {
    this._switchPlaylists = !this._switchPlaylists;
  }

  get open(): boolean {
    return this._switchPlaylists;
  }

}

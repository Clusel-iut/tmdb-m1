import { Component, OnInit } from '@angular/core';
import {MovieResponse} from '../tmdb-data/Movie';
import {User} from 'firebase';
import {Observable} from 'rxjs';
import {CreditsResult} from '../tmdb-data/MovieCredits';
import {TrendingResult} from '../tmdb-data/Trending';
import {TmdbService} from '../tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {filter} from 'rxjs/operators';
import {PlaylistService} from '../playlist.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  private _movie: MovieResponse;
  private _user: User;
  private dbData: Observable<any>;
  private _credits: CreditsResult;
  private _trendingMovie: TrendingResult;
  private _seriesTrending: TrendingResult;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase, private playlistSvc: PlaylistService) {
    this.anAuth.user.pipe(filter( u => !!u )).subscribe( u => {
      this._user = u;
    });
    setTimeout( () =>
        tmdb.getTrendingMovies()
          .then( (tm: TrendingResult) => console.log('Trending :', this._trendingMovie = tm) )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
    setTimeout( () =>
        tmdb.getTrendingSeries()
          .then( (ts: TrendingResult) => console.log('Trending :', this._seriesTrending = ts) )
          .catch( err => console.error('Error getting series:', err) ),
      1000 );

  }

  get movie(): MovieResponse {
    return this._movie;
  }

  get trendingsMovies(): TrendingResult {
    return this._trendingMovie;
  }

  get trendingsSeries(): TrendingResult {
    return this._seriesTrending;
  }

  getPath(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  get auth(): AngularFireAuth {
    return this.anAuth;
  }

  get user(): User {
    return this._user;
  }

  ngOnInit(): void {
  }
}

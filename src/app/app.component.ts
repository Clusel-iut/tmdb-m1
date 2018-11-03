import { Component } from '@angular/core';
import {TmdbService} from './tmdb.service';
import {MovieResponse} from './tmdb-data/Movie';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase';
import {Observable} from 'rxjs';
import {AngularFireDatabase} from '@angular/fire/database';
import {filter} from 'rxjs/operators';
import {CreditsResult} from './tmdb-data/MovieCredits';
import {TrendingResult} from './tmdb-data/Trending';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _movie: MovieResponse;
  private _user: User;
  private dbData: Observable<any>;
  private _credits: CreditsResult;
  private _trendingMovie: TrendingResult;
  private _seriesTrending: TrendingResult;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter( u => !!u )).subscribe( u => {
      this._user = u;


    });
    setTimeout( () =>
        tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
          .getMovie(13)
          .then( (m: MovieResponse) => console.log('Movie 13:', this._movie = m) )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
    setTimeout( () =>
        tmdb.getCredits(13)
          .then( (c: CreditsResult) => {
            this._credits = c;
            console.log('Actor 13:', c, this, '!');
          } )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
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

  get credits(): CreditsResult {
    return this._credits;
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
}
// /yE5d3BUhE8hCnkMUJOo1QDoOGNz.jpg

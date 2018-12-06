import { Component } from '@angular/core';
import {TmdbService} from './tmdb.service';
import {MovieResponse} from './tmdb-data/Movie';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from 'firebase';
import {filter} from 'rxjs/operators';
import {TrendingResult} from './tmdb-data/Trending';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _movie: MovieResponse;
  private _user: User;
  private _trendingMovie: TrendingResult;
  private _seriesTrending: TrendingResult;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth) {
    this.anAuth.user.pipe(filter( u => !!u )).subscribe( u => {
      this._user = u;
    });
    setTimeout( () =>
        tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
          .getTrendingMovies()
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

  get user(): User {
    return this._user;
  }
}

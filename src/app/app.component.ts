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
  private _trending: TrendingResult;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter( u => !!u )).subscribe( u => {
      this._user = u;
      const listsPath = `lists/${u.uid}`;
      const lists = db.list(listsPath);
      this.dbData = lists.valueChanges();
    });
    setTimeout( () =>
        tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
          .getMovie(13)
          .then( (m: MovieResponse) => console.log('Movie 13:', this._movie = m) )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
    setTimeout( () =>
        tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
          .getCredits(13)
          .then( (c: CreditsResult) => {
            this._credits = c;
            console.log('Actor 13:', c, this, '!');
          } )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
    setTimeout( () =>
        tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
          .getTrendingMovies()
          .then( (t: TrendingResult) => console.log('Trending :', this._trending = t) )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );

  }

  get movie(): MovieResponse {
    return this._movie;
  }

  get credits(): CreditsResult {
    return this._credits;
  }

  get trendings(): TrendingResult {
    return this._trending;
  }

  getPath(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  login() {
    this.anAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.anAuth.auth.signOut();
    this._user = undefined;
  }

  get user(): User {
    return this._user;
  }

  get lists(): Observable<any> {
    return this.dbData;
  }
}
// /yE5d3BUhE8hCnkMUJOo1QDoOGNz.jpg

import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase';
import {TmdbService} from '../tmdb.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {filter} from 'rxjs/operators';
import {MovieResponse} from '../tmdb-data/Movie';
import {CreditsResult} from '../tmdb-data/MovieCredits';
import {TrendingResult} from '../tmdb-data/Trending';
import {ResearchComponent} from '../research/research.component';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public _user: User;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter( u => !!u )).subscribe( u => {
      this._user = u;
    });
  }

  ngOnInit() {
  }

  login() {
    this.anAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  research() {
    // this.dialog.open(ResearchComponent);
  }

  logout() {
    this.anAuth.auth.signOut();
    this._user = undefined;
  }

  get user(): User {
    return this._user;
  }

  get userName(): string {
    return this._user.displayName;
  }
}

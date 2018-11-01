import {Component, Input, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input() private _auth: AngularFireAuth;
  @Input() private _user: User;
  constructor() { }

  ngOnInit() {
  }

  login() {
    this._auth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this._auth.auth.signOut();
    this._user = undefined;
  }
  get user(): User {
    return this._user;
  }

  get userName(): string {
    return this._user.displayName;
  }
}

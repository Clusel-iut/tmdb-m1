import { Component, OnInit } from '@angular/core';
import {User} from 'firebase';
import {filter} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  private _user: User;

  constructor(public anAuth: AngularFireAuth) {
    this.anAuth.user.pipe(filter( u => !!u )).subscribe( u => {
      this._user = u; });
  }

  get user(): User {
    return this._user;
  }
  ngOnInit() {
  }
}

import { Component, OnInit } from '@angular/core';
import {MovieResponse} from "../tmdb-data/Movie";
import {User} from "firebase";
import {TmdbService} from "../tmdb.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import {filter} from "rxjs/operators";
import {Observable} from "rxjs";
import {Playlist} from '../tmdb-data/Playlist';
import {PlaylistService} from '../playlist.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private _user: User;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase, private playlistSvc: PlaylistService) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
    });
  }

  ngOnInit() {
  }

  public ajouterListe(listName: string, event: Event = null) {
    this.playlistSvc.ajouterListe(listName, event);
  }

  public suprimerListe($key: string) {
    this.playlistSvc.suprimerListe($key);
  }

  get listes(): Observable<any> {
    return this.playlistSvc.listes;
  }
}



import { Component, OnInit } from '@angular/core';
import {MovieResponse} from "../tmdb-data/Movie";
import {User} from "firebase";
import {TmdbService} from "../tmdb.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import {filter} from "rxjs/operators";
import {Observable} from "rxjs";
import {Playlist} from '../tmdb-data/Playlist';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public _playlists: AngularFireList<any>;
  private _user: User;
  private basePath: string;
  private dbListes: Observable<any[]>;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
      this.basePath = `${u.uid}/playlists`;
      this._playlists = this.db.list(this.basePath);
      this.dbListes = this._playlists.snapshotChanges();
    });
  }

  ngOnInit() {
  }

  public ajouterListe(listName: string, event: Event = null) {
    if (event != null) { event.preventDefault(); }
    this._playlists.push(new Playlist(listName));
  }

  public ajouterFilmListe(list: any, filmId: string) {
    list.films.push(filmId);
    this._playlists.update(list.$key, list);
  }

  public suprimerListe($key: string) {
    console.log($key);
    this._playlists.remove($key);
  }

  public supprimerListeFilm(list: any, filmId: string) {
    const index = list.films.indexOf(filmId, 0);
    if (index > -1) {
      list.films.splice(index, 1);
    }
    this._playlists.update(list.$key, list);
  }

  get listes(): Observable<any> {
    return this.dbListes;
  }
}



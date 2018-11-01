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

  public _listes: AngularFireList<{}>;
  public _playlists: Playlist[];
  private _user: User;
  private database: AngularFireDatabase;
  private dbListes: Observable<any>;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
      const listsPath = `${u.uid}`;
      this.database = db;
      this._listes = this.database.list(listsPath);
      this.dbListes = this._listes.valueChanges();
    });
  }

  ngOnInit() {
  }

  public ajouterListe(listName: string) {
    const filmsListePath = `${this._user.uid}/liste/${listName}`;
    const filmsListe = this.database.list(filmsListePath);
    filmsListe.push("");
  }

  public ajouterFilmListe(listName: string, filmId: string) {
    const filmsListePath = `${this._user.uid}/liste/${listName}`;
    const filmsListe = this.database.list(filmsListePath);

    filmsListe.push(filmId);
  }

  public suprimerListe(listName: string) {
    const filmsListePath = `${this._user.uid}/liste/`;
    const filmsListe = this.database.list(filmsListePath);
    filmsListe.remove(listName);
  }

  public supprimerListeFilm(listName: string, filmId: string) {
    const filmsListePath = `${this._user.uid}/liste/${listName}`;
    const filmsListe = this.database.list(filmsListePath);
    filmsListe.remove(filmId.toString());
  }

  public getFilmsFromPlaylist(listName: string): Playlist {
    const filmsListePath = `${this._user.uid}/liste/${listName}`;
    const filmsListe = this.database.list(filmsListePath);

    const playlist = new Playlist(listName);
    filmsListe.valueChanges().forEach((e) => playlist.addFilm(e.toString()));

    return playlist;
  }

  get listes(): Observable<any> {
    return this.dbListes;
  }

  get listes2(): Playlist[] {
    //this.dbListes.subscribe((e) => this._playlists.push());
    return this._playlists;
  }
}



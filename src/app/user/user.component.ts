import { Component, OnInit } from '@angular/core';
import {MovieResponse} from "../tmdb-data/Movie";
import {User} from "firebase";
import {TmdbService} from "../tmdb.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/database";
import {filter} from "rxjs/operators";
import {Observable} from "rxjs";

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
      this.listes.forEach((e) => this._playlists.push(new Playlist(e.valueOf())))
      this.dbListes = this._listes.valueChanges();

      this.ajouterListe("test1");
      this.ajouterFilmListe("test1", "1");
    });
  }

  ngOnInit() {
  }

  ajouterListe(listName: string) {
    const filmsListePath = `${this._user.uid}/liste/${listName}`;
    const filmsListe = this.database.list(filmsListePath);
    filmsListe.push("");
  }

  ajouterFilmListe(listName: string, filmId: string) {
    const filmsListePath = `${this._user.uid}/liste/${listName}`;
    const filmsListe = this.database.list(filmsListePath);

    filmsListe.push(filmId);
  }

  suprimerListe(listName: string){
    const filmsListePath = `${this._user.uid}/liste/`;
    const filmsListe = this.database.list(filmsListePath);
    filmsListe.remove(listName);
  }

  supprimerListeFilm(listName: string, filmId: string){
    const filmsListePath = `${this._user.uid}/liste/${listName}`;
    const filmsListe = this.database.list(filmsListePath);
    filmsListe.remove(filmId.toString());
  }

  get listes(): Observable<any> {
    return this.dbListes;
  }
}



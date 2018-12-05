import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {User} from 'firebase';
import {TmdbService} from './tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter} from 'rxjs/operators';
import {LISTE} from './tmdb-data/Liste';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private _playlists: AngularFireList<any>;
  private _user: User;
  private basePath: string;
  private favoris: LISTE;
  private listes: LISTE[];

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
      this.basePath = `${u.uid}/playlists`;
      this._playlists = this.db.list(this.basePath);

      this._playlists.snapshotChanges().subscribe( data => { this.listes = [];
        data.forEach(value => {
          const liste: LISTE = {
            $key: value.key,
            name: value.payload.val().name,
            films: value.payload.val().films
          };
          if (liste.films === undefined) {
            liste.films = [];
          }
          if (liste.name === 'Favoris') {
            this.favoris = liste;
          } else {
            this.listes.push(liste);
          }
        });
      });

      this.ajouterListe('Favoris');
    });
  }

  public ajouterListe(listName: string, event: Event = null) {
    if (event != null) {
      event.preventDefault();
    }
    let exist = false;
    this.listes.forEach(list => {
      if (list.name === listName) {
        exist = true;
      }
    });
    if (!exist) {
      const liste: LISTE = {
        name: listName,
        films: []
      };
      this._playlists.push(liste);
    }
  }

  public suprimerListe(liste: LISTE) {
    this._playlists.remove(liste.$key);
  }

  public ajouterFilmListe(liste: LISTE, filmId: string) {
    const updateListe: LISTE = {
      name: liste.name,
      films: []
    };
    if (liste.films !== []) {
      updateListe.films = liste.films;
    }
    if (this.estDansListe(liste, filmId) === false) {
      updateListe.films.push(filmId);
      this._playlists.update(liste.$key, updateListe);
    }
  }

  public supprimerFilmListe(liste: LISTE, filmId: string) {
    const updateListe: LISTE = {
      name: liste.name,
      films: liste.films
    };
    const index = updateListe.films.indexOf(filmId);
    updateListe.films.splice(index);
    this._playlists.update(liste.$key, updateListe);
  }

  get getListes(): LISTE[] {
    return this.listes;
  }

  get getFavoris(): LISTE {
    return this.favoris;
  }

  public estDansListe(liste: LISTE, filmId: string): boolean {
    let exist = false;

    liste.films.forEach(value => {
      if (Number(value) === Number(filmId)) {
        exist = true;
      }});

    return exist;
  }

  public estFavoris(filmId: string): boolean {
    const test = this.estDansListe(this.favoris, filmId);
    return test;
  }
}

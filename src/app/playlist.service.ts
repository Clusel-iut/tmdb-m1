import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {User} from 'firebase';
import {Observable} from 'rxjs';
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
  private listes: LISTE[] = [];

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
      this.basePath = `${u.uid}/playlists`;
      this._playlists = this.db.list(this.basePath);

      this._playlists.snapshotChanges().subscribe( data => {
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
    if (event != null) { event.preventDefault(); }
    let exist = false;
    this._playlists.query.once('value').then(value => {
      value.forEach(list => {
        console.log('-----------------------------------');
        console.log(list.val().payload.node_.value_);
        if (value.val().name === listName) {
          exist = true;
        }
      });
      }).then(value => {
        if (!exist) {
          const liste: LISTE = {
            name: listName,
            films: []
          };
          this._playlists.push(liste);
        }
      }
    );
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
    updateListe.films.push(filmId);
    this._playlists.update(liste.$key, updateListe);
  }

  public supprimerListeFilm(liste: LISTE, filmId: string) {

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
      if (value === filmId) {
        exist = true;
      }});

    return exist;
  }

  public estFavoris(filmId: string): boolean {
    return this.estDansListe(this.favoris, filmId);
  }
}

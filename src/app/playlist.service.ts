import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {User} from 'firebase';
import {Observable} from 'rxjs';
import {TmdbService} from './tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter} from 'rxjs/operators';
import {Playlist} from './tmdb-data/Playlist';
import {forEach} from '@angular/router/src/utils/collection';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private _playlists: AngularFireList<any>;
  private _favoris: AngularFireList<any>;
  private _movies: AngularFireList<any>;
  private _user: User;
  private basePath: string;
  private basePathMovies: string;
  private dbListes: Observable<any[]>;
  private dbMovies: Observable<any[]>;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
      this.basePath = `${u.uid}/playlists`;
      this._playlists = this.db.list(this.basePath);
      this.dbListes = this._playlists.snapshotChanges();
    });
  }

  public ajouterListe(listName: string, event: Event = null) {
    if (event != null) { event.preventDefault(); }

    let test = false;
    this.listes.forEach(value => {
      console.log(value);
      if (value.payload.val().name === listName) {
      test = true;
    }
    }).then( () => {
      if (test === false) {
        this._playlists.push(new Playlist(listName));
      }
    }
    );
  }

  public ajouterFilmListe(list: any, filmId: string) {
    const playlist = new Playlist(list.payload.val().name);
    if (list.payload.val().films !== undefined) {
      playlist.films = list.payload.val().films;
    }
    playlist.films.push(filmId);
    this._playlists.update(list.key, playlist);
  }

  public suprimerListe($key: string) {
    this._playlists.remove($key);
  }

  public supprimerListeFilm(list: any, filmId: string) {
    const playlist = new Playlist(list.payload.val().name);
    if (list.payload.val().films !== undefined) {
      playlist.films = list.payload.val().films;
    }
    const index = playlist.films.indexOf(filmId, 0);
    if (index > -1) {
      list.films.splice(index, 1);
    }
    this._playlists.update(list.key, playlist);
  }

  get listes(): Observable<any> {
    return this.dbListes;
  }

  public estFavoris(list: any, filmId: string): boolean {
    const playlist = new Playlist(list.payload.val().name);
    if (list.payload.val().films !== undefined){
      playlist.films = list.payload.val().films;
    }
    return playlist.films.indexOf(filmId) !== -1;
  }

  initMovies(key: any): Observable<any> {
    this.basePathMovies = `${this._user.uid}/playlists/${key}/films`;
    this._movies = this.db.list(this.basePathMovies);
    this.dbMovies = this._movies.snapshotChanges();
    return this.dbMovies;
  }

  get movies(): Observable<any> {
    return this.dbMovies;
  }

  public getMoviesId(key: any) {


  }

  /*public estFavoris(idFilm: string): boolean {
      let exist = false;
      this.db.database.ref(this.basePathFavoris).once('value').then((snapshot) => {
        snapshot.forEach( (childSnapshot) => {
          if (childSnapshot.val() as string === idFilm) {
            exist = true;
          }
        });
      });
      return exist;
  }*/
  /*async estFavoris(idFilm: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let exist = false;
      this.db.database.ref(this.basePathFavoris).once('value').then((snapshot) => {
        snapshot.forEach( (childSnapshot) => {
          if (childSnapshot.val() as string === idFilm) {
            exist = true;
          }
        });
      })
      setTimeout( () => {
        resolve(exist);
      }, 1000);
    });
  }*/

  /*public ajouterFavoris(idFilm: string) {
    this._favoris.push(idFilm);
  }

  public suprimerFavoris(idFilm: string) {
    this._favoris.remove(idFilm);
  }*/
}

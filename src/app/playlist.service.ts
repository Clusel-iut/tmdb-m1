import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {User} from 'firebase';
import {TmdbService} from './tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter} from 'rxjs/operators';
import {LISTE, LISTEPARTAGE} from './tmdb-data/Liste';
import {TrendingResult} from './tmdb-data/Trending';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  private _user: User;
  private _dbListes: AngularFireList<any>;
  private _dbListesPartagees: AngularFireList<any>;
  private basePathListes: string;
  private basePathListesPartagees: string;
  private favoris: LISTE;
  private listes: LISTE[];
  private listesPartagees: LISTE[];

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
      this.basePathListes = `${u.uid}/playlists`;
      this.basePathListesPartagees = `playlists-partagees`;

      this._dbListes = this.db.list(this.basePathListes);
      this._dbListesPartagees = this.db.list(this.basePathListesPartagees);

      this.getMesListes();
      this.getMesListesPartagees();
    });
  }

  public getMesListes() {
    this._dbListes.snapshotChanges().subscribe( data => {
      this.listes = [];
      this.favoris = undefined;
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
    setTimeout( () =>
      this.ajouterListe('Favoris'), 1000 );
  }

  public ajouterListe(listName: string, event: Event = null) {
    if (event != null) {
      event.preventDefault();
    }
    let exist = false;
    if (this.listes !== undefined) {
      this.listes.forEach(list => {
        if (list.name === listName) {
          exist = true;
        }
      });
    }
    if (this.favoris !== undefined && this.favoris.name === listName) {
      exist = true;
    }
    if (!exist) {
      const liste: LISTE = {
        name: listName,
        films: []
      };
      this._dbListes.push(liste);
    }
  }

  public suprimerListe(liste: LISTE) {
    this._dbListes.remove(liste.$key);
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
      this._dbListes.update(liste.$key, updateListe);
    }
  }

  public supprimerFilmListe(liste: LISTE, filmId: string) {
    const updateListe: LISTE = {
      name: liste.name,
      films: liste.films
    };
    const index = updateListe.films.indexOf(filmId);
    updateListe.films.splice(index, 1);
    this._dbListes.update(liste.$key, updateListe);
  }

  get getListes(): LISTE[] {
    return this.listes;
  }

  get getListesPartagees(): LISTE[] {
    return this.listesPartagees;
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

  public partagerListe(liste: LISTE, email: string) {
    const listePartage: LISTEPARTAGE = {
      email: email,
      key: liste.$key,
      uid: this._user.uid
    };
    this._dbListesPartagees.push(listePartage);
  }

  public getMesListesPartagees() {
    const listesPartageesTab = [];
    this._dbListesPartagees.valueChanges().subscribe( (data: LISTEPARTAGE[]) => {
      data.forEach(value => {
        if (value.email === this._user.email) {
          listesPartageesTab.push(value);
        }
        });
    });
    setTimeout( () => {
        listesPartageesTab.forEach(value3 => {
          const basePath = `${value3.uid}/playlists`;
          this.db.list(basePath).snapshotChanges().subscribe( data1 => {
            this.listesPartagees = [];
            data1.forEach(value1 => {
              if (value1.key === value3.key) {
                const liste: LISTE = {
                  $key: value1.key,
                  name: (value1.payload.val() as LISTE).name,
                  films: (value1.payload.val() as LISTE).films
                };
                if (liste.films === undefined) {
                  liste.films = [];
                }
                this.listesPartagees.push(liste);
              }
            });
          });
        });
      }
      , 1000 );
  }
}

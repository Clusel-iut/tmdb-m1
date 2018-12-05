import { Component, OnInit } from '@angular/core';
import {MovieResponse} from '../tmdb-data/Movie';
import {User} from 'firebase';
import {TmdbService} from '../tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter} from 'rxjs/operators';
import {PlaylistService} from '../playlist.service';
import {TrendingDetails, TrendingResult} from '../tmdb-data/Trending';
import {LISTE} from '../tmdb-data/Liste';

@Component({
  selector: 'app-user',
  templateUrl: './user-liste.component.html',
  styleUrls: ['./user-liste.component.css']
})
export class UserListeComponent implements OnInit {

  private _user: User;
  private _listMovies: TrendingResult;
  private _nameList: string;
  private _list: LISTE;
  private _open: boolean;

  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private playlistSvc: PlaylistService) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
    });
    this._open = false;
  }

  ngOnInit() {
  }

  public ajouterListe(listName: string, event: Event = null) {
    this.playlistSvc.ajouterListe(listName, event);
  }

  public suprimerListe(liste: LISTE) {
    this.playlistSvc.suprimerListe(liste);
  }

  get listes(): LISTE[] {
    return this.playlistSvc.getListes;
  }

  get favoris(): LISTE {
    return this.playlistSvc.getFavoris;
  }

  afficherListe(list: LISTE, nameList: string) {
    this._listMovies = {results: []};
    this._list = list;
    this._list.films.forEach(filmId => {
        setTimeout( () =>
            this.tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
              .getMovie(Number(filmId))
              .then( (m: MovieResponse) => {
                const tr: TrendingDetails = {poster_path: m.poster_path, id: m.id, title: m.title, original_title: m.original_title};
                this._listMovies.results.push(tr);
              } )
              .catch( err => console.error('Error getting movie:', err) ),
          1000 );
      });
      this._nameList = nameList;
      this._open = true;
  }

  get listMovies(): TrendingResult {
    return this._listMovies;
  }

  get nameList(): string {
    return this._nameList;
  }

  get list(): LISTE {
    return this._list;
  }

  get open(): boolean {
    return this._open;
  }
}



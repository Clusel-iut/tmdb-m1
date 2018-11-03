import { Component, OnInit } from '@angular/core';
import {MovieResponse} from '../tmdb-data/Movie';
import {User} from 'firebase';
import {TmdbService} from '../tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import {filter} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Playlist} from '../tmdb-data/Playlist';
import {PlaylistService} from '../playlist.service';
import {TrendingDetails, TrendingResult} from '../tmdb-data/Trending';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private _user: User;
  private _listMovies: TrendingResult;
  private _nameList: string;

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

  afficherListe(key: any, nameList: string) {
    this._listMovies = {results: []};
    this.playlistSvc.initMovies(key).forEach(k => {
      k.forEach(finalKey => {
        console.log(finalKey.payload.node_.value_);
        setTimeout( () =>
            this.tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
              .getMovie(finalKey.payload.node_.value_)
              .then( (m: MovieResponse) => {
                console.log('Coucou');
                const tr: TrendingDetails = {poster_path: m.poster_path, id: m.id, title: m.title, original_title: m.original_title};
                this._listMovies.results.push(tr);
              } )
              .catch( err => console.error('Error getting movie:', err) ),
          1000 );
      });
      this._nameList = nameList;
    });
  }

  get listMovies(): TrendingResult {
    return this._listMovies;
  }

  get nameList(): string {
    return this._nameList;
  }

}



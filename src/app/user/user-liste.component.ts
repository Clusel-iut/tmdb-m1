import { Component, OnInit } from '@angular/core';
import {MovieResponse} from '../tmdb-data/Movie';
import {User} from 'firebase';
import {TmdbService} from '../tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter} from 'rxjs/operators';
import {PlaylistService} from '../playlist.service';
import {TrendingDetails, TrendingResult} from '../tmdb-data/Trending';
import {LISTE, LISTEPARTAGE} from '../tmdb-data/Liste';
import {forEach} from "@angular/router/src/utils/collection";
import {MatDialog, MatDialogConfig} from '@angular/material';
import {PopupComponent} from '../popup/popup.component';

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
  private _cpt: number;
  private _isSelected: boolean;
  constructor(private tmdb: TmdbService, public anAuth: AngularFireAuth, private playlistSvc: PlaylistService, public dialog: MatDialog) {
    this.anAuth.user.pipe(filter(u => !!u)).subscribe(u => {
      this._user = u;
    });
    this._open = false;
    this._cpt = 0;
    this._isSelected = false;
  }

  ngOnInit() {
  }

  get getSelected(){return this._isSelected; }
  public isSelected(set: boolean): boolean { return this._isSelected = set; }

  public ajouterListe(listName: string, event: Event = null) {
    this.playlistSvc.ajouterListe(listName, event);
  }

  public suprimerListe(liste: LISTE) {
    this.playlistSvc.suprimerListe(liste);
  }

  get listes(): LISTE[] {
    return this.playlistSvc.getListes;
  }

  get listesPartagees(): LISTE[] {
    return this.playlistSvc.getListesPartagees;
  }

  get favoris(): LISTE {
    return this.playlistSvc.getFavoris;
  }

  afficherListe(list: LISTE, nameList: string ) {
    this._listMovies = {results: []};
    this._list = list;
    this._list.films.forEach(filmId => {
      setTimeout(() =>
          this.tmdb.init('5feeece3bd352a14822e8426b8af7e01') // Clef de TMDB
            .getMovie(Number(filmId))
            .then((m: MovieResponse) => {
              const tr: TrendingDetails = {
                poster_path: m.poster_path,
                id: m.id,
                title: m.title,
                original_title: m.original_title
              };
              this._listMovies.results.push(tr);
            })
            .catch(err => console.error('Error getting movie:', err)),
        1000);
    });

    this._nameList = nameList;
    this._open = true;
    for (let i = 0; i < document.getElementsByTagName('div').length; i++){
      document.getElementsByTagName('div').item(i).classList.remove('selected');
    }
    document.getElementById(nameList).classList.toggle('selected');
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

  get cpt(): number {
    return this._cpt += 1;
  }

  public partagerListe(liste: LISTE, email: string) {
    this.playlistSvc.partagerListe(liste, email);
    this.openModal(liste, true);
  }

  public supprimerListePartagee(liste: LISTE) {
    this.playlistSvc.supprimerListePartagee(liste);
    this.openModal(liste, false);
  }

  openModal(list: LISTE, ajout: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: list.name,
      share: true,
      estAjoute: ajout
    };
    const dialogRef = this.dialog.open(PopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed');
      console.log(result);
    });
  }
}



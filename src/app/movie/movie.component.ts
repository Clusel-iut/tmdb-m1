import {Component, Input, OnInit} from '@angular/core';
import {MovieResponse} from '../tmdb-data/Movie';
import {CreditsResult} from '../tmdb-data/MovieCredits';
import {UserListeComponent} from '../user/user-liste.component';
import {PlaylistService} from '../playlist.service';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {filter} from 'rxjs/internal/operators';
import {User} from 'firebase';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PopupComponent } from '../popup/popup.component';
import {LISTE} from '../tmdb-data/Liste';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})

export class MovieComponent implements OnInit {

  @Input() private _movie: MovieResponse;
  @Input() private _credits: CreditsResult;
  private _switchPlaylists: boolean;
  private _user: User;

  constructor(public playlistSvc: PlaylistService,  public anAuth: AngularFireAuth, public dialog: MatDialog) {
    this._switchPlaylists = true;
    this.anAuth.user.pipe(filter( u => !!u )).subscribe( u => {
      this._user = u;
    });
  }

  ngOnInit() {
  }

  get credits(): CreditsResult {
    return this._credits;
  }

  get movie(): MovieResponse {
    return this._movie;
  }

  getPath(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }

  get open(): boolean {
    return this._switchPlaylists;
  }

  switch() {
    this._switchPlaylists = !this._switchPlaylists;
  }

  public ajouterFilmListe(list: LISTE, filmId: string, open: boolean) {
    if (open) {
      this._switchPlaylists = !this._switchPlaylists;
    }
    this.playlistSvc.ajouterFilmListe(list, filmId);
    if(list.name === 'Favoris') {
      this.movie.estFavoris = !this.movie.estFavoris;
    }
    this.openModal(list, true);
  }

  public supprimerFilmListe(list: LISTE, filmId: string) {
    this.playlistSvc.supprimerFilmListe(list, filmId);
    if(list.name === 'Favoris') {
      this.movie.estFavoris = !this.movie.estFavoris;
    }
    this.openModal(list, false);
  }

  openModal(list: LISTE, Ajoute: boolean) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: this.movie.title,
      list: list.name,
      estAjoute: Ajoute
    };
    const dialogRef = this.dialog.open(PopupComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed');
      console.log(result);
    });
  }

  get listes(): LISTE[] {
    return this.playlistSvc.getListes;
  }

  get favoris(): LISTE {
    return this.playlistSvc.getFavoris;
  }

  get user(): User {
    return this._user;
  }
}

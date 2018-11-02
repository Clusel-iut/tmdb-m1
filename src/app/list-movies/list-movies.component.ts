import {Component, Input, OnInit} from '@angular/core';
import {TrendingResult} from '../tmdb-data/Trending';
import {TmdbService} from '../tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';
import {MatDialog} from '@angular/material';
import {DialogfilmComponent} from '../popup/dialogfilm/dialogfilm.component';
@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.css']
})

export class ListMoviesComponent implements OnInit {

  @Input('trendings') private _trendings: TrendingResult;

  constructor (private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase, public dialog: MatDialog) {
  }

  get trendings(): TrendingResult {
    return this._trendings;
  }

  getPath(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  ngOnInit() {
  }

  openMovie(elem: any) {
    this.dialog.open(DialogfilmComponent, {height: '100%', width: '50%', data: {elem: elem}});
  }

}

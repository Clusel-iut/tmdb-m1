import {Component, Input, OnInit} from '@angular/core';
import {TrendingResult} from '../tmdb-data/Trending';
import {TmdbService} from '../tmdb.service';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.css']
})

export class ListMoviesComponent implements OnInit {

  @Input('trendings') private _trendings: TrendingResult;

  constructor (private tmdb: TmdbService, public anAuth: AngularFireAuth, private db: AngularFireDatabase) {
  }

  get trendings(): TrendingResult {
    return this._trendings;
  }

  getPath(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  ngOnInit() {
  }

  openMovie(id: string) {

  }

}

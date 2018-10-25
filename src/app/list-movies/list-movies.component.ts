import {Component, Input, OnInit} from '@angular/core';
import {TrendingResult} from '../tmdb-data/Trending';

@Component({
  selector: 'app-list-movies',
  templateUrl: './list-movies.component.html',
  styleUrls: ['./list-movies.component.css']
})

export class ListMoviesComponent implements OnInit {

  @Input('trendings') private _trendings: TrendingResult;

  constructor() { }

  get trendings(): TrendingResult {
    return this._trendings;
  }

  getPath(path: string): string {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  ngOnInit() {
  }

}

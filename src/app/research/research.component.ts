import { Component, OnInit } from '@angular/core';
import {TmdbService} from '../tmdb.service';
import {MovieResponse} from '../tmdb-data/Movie';
import {TrendingResult} from '../tmdb-data/Trending';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent implements OnInit {

  private _trendingMovie: TrendingResult;
  private _service: TmdbService;

  constructor(private tmdb: TmdbService) {
    this._service = tmdb;
  }

  ngOnInit() {
  }

  research(request: string) {
    setTimeout( () =>
        this._service.searchMovie(request)
          .then( (tm: TrendingResult) => console.log('Trending :', this._trendingMovie = tm) )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
  }

  researchElements() {
    return this._trendingMovie;
  }

  debug() {
    console.log('hello');
  }

}

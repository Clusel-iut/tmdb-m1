import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TmdbService} from '../../tmdb.service';
import {CreditsResult} from '../../tmdb-data/MovieCredits';

@Component({
  selector: 'app-dialogfilm',
  templateUrl: './dialogfilm.component.html',
  styleUrls: ['./dialogfilm.component.css']
})
export class DialogfilmComponent implements OnInit {
  private _credits: CreditsResult;

  constructor ( private tmdb: TmdbService, private matDialogRef: MatDialogRef<DialogfilmComponent>, @Inject(MAT_DIALOG_DATA) public data: any ) {}

  ngOnInit() {


  }
   getPath(path: any) {
    return `https://image.tmdb.org/t/p/w500${path}`;
  }
  getcredits(id: number): CreditsResult {
    setTimeout( () =>
        this.tmdb.getCredits(13)
          .then( (c: CreditsResult) => {
            this._credits = c;
            console.log('Actor 13:', c, this, '!');
          } )
          .catch( err => console.error('Error getting movie:', err) ),
      1000 );
    //this._credits = <CreditsResult>this.tmdb.getCredits(id);
    return this._credits;
  }
  op(id: number) {
    console.log(id);
  }
}

import  { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TmdbService} from './tmdb.service';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { UserComponent } from './user/user.component';
import { MovieComponent } from './movie/movie.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ListMoviesComponent } from './list-movies/list-movies.component';
import { ResearchComponent } from './research/research.component';
import { DialogfilmComponent } from './popup/dialogfilm/dialogfilm.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    MovieComponent,
    NavbarComponent,
    ListMoviesComponent,
    ResearchComponent,
    DialogfilmComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp( environment.firebase ),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MatDialogModule,
    MatButtonModule,
    BrowserAnimationsModule
  ],
  providers: [TmdbService],
  bootstrap: [AppComponent],
  entryComponents: [ DialogfilmComponent ]
})
export class AppModule { }

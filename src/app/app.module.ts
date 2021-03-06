import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {TmdbService} from './tmdb.service';
import {HttpClientModule} from '@angular/common/http';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import { UserListeComponent } from './user/user-liste.component';
import { MovieComponent } from './movie/movie.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ListMoviesComponent } from './list-movies/list-movies.component';
import { ResearchComponent } from './research/research.component';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { PopupComponent } from './popup/popup.component';



const appRoutes: Routes = [
  { path: 'home', component: HomepageComponent},
  { path: 'research', component: ResearchComponent },
  { path: 'playlist', component: UserListeComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '***', component: HomepageComponent}
];


@NgModule({
  declarations: [
    AppComponent,
    UserListeComponent,
    MovieComponent,
    NavbarComponent,
    ListMoviesComponent,
    ResearchComponent,
    HomepageComponent,
    PopupComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp( environment.firebase ),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    MatDialogModule,
    MatButtonModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  entryComponents: [
    PopupComponent
  ],
  providers: [TmdbService],
  bootstrap: [AppComponent]
})
export class AppModule { }

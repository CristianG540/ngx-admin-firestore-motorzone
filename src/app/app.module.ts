/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { HttpModule } from '@angular/http'
import { CoreModule } from './@core/core.module'
import { HttpClientModule } from '@angular/common/http' // angular >5

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { ThemeModule } from './@theme/theme.module'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { NB_AUTH_TOKEN_WRAPPER_TOKEN, NbAuthJWTToken } from '@nebular/auth'

import { AuthGuard } from './auth-guard.service'

import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth'

// Libs terceros
import { AngularFireModule } from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDz-mE75HwL7w2NerpJLEa_Y6VgWJNKxCE',
  authDomain: 'motorzone-efef6.firebaseapp.com',
  databaseURL: 'https://motorzone-efef6.firebaseio.com',
  projectId: 'motorzone-efef6',
  storageBucket: 'motorzone-efef6.appspot.com',
  messagingSenderId: '797056667535'
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot()
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: NB_AUTH_TOKEN_WRAPPER_TOKEN, useClass: NbAuthJWTToken },
    AuthGuard,
    AngularFireDatabase
  ]
})
export class AppModule {
}

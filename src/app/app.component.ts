/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core'
import { AnalyticsService } from './@core/utils/analytics.service'

// AngularFire - Firebase
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor (
    private analytics: AnalyticsService,
    private angularFireAuth: AngularFireAuth,
    private angularFireDB: AngularFireDatabase
  ) {

    this.angularFireAuth.auth.signInAndRetrieveDataWithEmailAndPassword(
      'desarrollowebigb@gmail.com',
      '123456'
    ).then(res => {
      console.log('Info login firebase', res)
    }).catch(err => console.error('Error login firebase', err))

  }

  ngOnInit (): void {
    this.analytics.trackPageViews()
  }
}

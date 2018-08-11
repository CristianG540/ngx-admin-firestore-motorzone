/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core'
import { AnalyticsService } from './@core/utils/analytics.service'
import { Subject, BehaviorSubject } from 'rxjs'

// AngularFire - Firebase
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth'

// Services
import { VendedorService } from './@core/data/vendedor/vendedor.service'

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor (
    private analytics: AnalyticsService,
    private angularFireAuth: AngularFireAuth,
    private angularFireDB: AngularFireDatabase,
    private vendedoresService: VendedorService
  ) {

    this.vendedoresService.vendedorServIsInit$ = new BehaviorSubject(null)
    this.angularFireAuth.auth.signInAndRetrieveDataWithEmailAndPassword(
      'c@c.com',
      '123456'
    ).then(res => {
      console.log('Info login firebase', res)
      // "Inicio" la subscripcion a los datos de la bd en firestore
      return this.vendedoresService.initFirebase()
    }).then(res => {
      this.vendedoresService.vendedorServIsInit$.next(res)
    })
    .catch(err => console.error('Error "error login firebase" - AppComponent|constructor() - /app/app.component.ts', err))

  }

  ngOnInit (): void {
    this.analytics.trackPageViews()
  }
}

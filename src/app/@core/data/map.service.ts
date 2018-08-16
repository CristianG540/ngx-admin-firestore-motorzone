import { Injectable } from '@angular/core'
import { environment } from '../../../environments/environment'

// Libs terceros
import mapboxgl from 'mapbox-gl'

@Injectable()
export class StateService {

  constructor () {
    mapboxgl.accessToken = environment.mapbox.accessToken
  }

}

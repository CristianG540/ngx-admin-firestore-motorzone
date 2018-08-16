import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Subscription, fromEvent } from 'rxjs'

// Libs terceros
import * as mapboxgl from 'mapbox-gl'
import { featureCollection, multiPoint, point } from '@turf/helpers'
import { map, chain } from 'lodash'
import * as moment from 'moment'
import * as randomColor from 'randomcolor'

// Services
import { VendedorService } from '../../../../@core/data/vendedor/vendedor.service'

// Models
import { Orden } from '../../../../@core/data/orden/models/orden'

@Component({
  selector: 'ngx-map-box-ordenes',
  styleUrls: ['./map-box-ordenes.component.scss'],
  templateUrl: 'map-box-ordenes.component.html'
})
export class MapBoxOrdenesComponent implements AfterViewInit, OnDestroy {

  @Input() private userId: string = ''
  private _lat: number = 4.0777137
  private _lng: number = -70.6985415
  private _zoom: number = 5
  private _map: mapboxgl.Map
  // Referencia a la coleccion con las coordenadas marcadas por el usuario
  private _userCoordsSubscription: Subscription

  constructor (
    private activeModal: NgbActiveModal,
    private vendedoresServ: VendedorService
  ) {
  }

  ngAfterViewInit () {

    const inputDate = document.getElementById('date')
    const inputDateObserv = fromEvent(inputDate, 'change')

    inputDateObserv.subscribe(val => console.log('prueba subs', val), err => console.error(err))

    this._map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [this._lng, this._lat],
      zoom: this._zoom
    })

    this._map.on('load', () => {

      this._map.addSource('userCoords', {
        type: 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': []
        }
      })
      this._map.addLayer({
        'id': 'userCoords',
        'source': 'userCoords',
        'type': 'circle',
        'paint': {
          'circle-radius': 5,
          'circle-color': {
            type: 'identity',
            property: 'color'
          }
        }
      })
      this._userCoordsSubscription = this.vendedoresServ.userCoordsRef.valueChanges().subscribe(
        coords => {

          const geojsonCoordsByDay: any = chain(coords)
            .groupBy(coord => {
              return moment(coord.timestamp).format('MM-DD-YYYY')
            })
            .map((group, keyGroup, coordsByDay) => {
              const color = randomColor()
              return map(group, coord => {
                return point([coord.longitude, coord.latitude], { color: color, timestamp: coord.timestamp })
              })
            })
            .flatten()
            .value()

          console.log('coordenas:', featureCollection(geojsonCoordsByDay))
          const source: any = this._map.getSource('userCoords')
          source.setData(featureCollection(geojsonCoordsByDay))
        },
        err => {
          console.error('"Error subscribe coordenadas" - MapBoxOrdenesComponent|ngOnInit() - map-box-ordenes.component.ts', err)
        }
      )

    })

  }

  ngOnDestroy () {
    this._userCoordsSubscription.unsubscribe()
  }

  clickedMarker (e): void {
    console.log('Marcador clicckeado:', e)
  }

  closeModal () {
    this.activeModal.close()
  }

}

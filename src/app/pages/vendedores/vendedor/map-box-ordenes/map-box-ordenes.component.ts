import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Subscription, fromEvent, BehaviorSubject } from 'rxjs'
import { switchMap, map } from 'rxjs/operators'

// Libs terceros
import * as mapboxgl from 'mapbox-gl'
import { featureCollection, multiPoint, point } from '@turf/helpers'
import { map as _map, chain, filter } from 'lodash'
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
  private _selectedDay: string
  // Referencia a la coleccion con las coordenadas marcadas por el usuario
  private _userCoordsSubscription: Subscription
  private _inputDateSubs: Subscription

  constructor (
    private activeModal: NgbActiveModal,
    private vendedoresServ: VendedorService
  ) {
  }

  ngAfterViewInit () {

    const inputDate = document.getElementById('date')
    const inputDateObserv = fromEvent(inputDate, 'change')
    const subjectChangeDate$: BehaviorSubject<any | null> = new BehaviorSubject(null)
    this._inputDateSubs = inputDateObserv.subscribe(event => subjectChangeDate$.next(event), err => console.error(err))

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

      this._userCoordsSubscription = subjectChangeDate$.pipe(
        switchMap(event => {
          this._selectedDay = event ? (document.getElementById((event.target as any).id) as any).value : null
          return this.vendedoresServ.userCoordsRef.valueChanges()
        }),
        map(coords => {
          console.log('dia', this._selectedDay)
          if (!this._selectedDay) {
            return coords
          }
          const coordsBySelectedDay = filter(coords, coord => {
            return moment(coord.timestamp).format('YYYY-MM-DD') === this._selectedDay
          })
          return coordsBySelectedDay
        })
      ).subscribe(
        coords => {

          const geojsonCoordsByDay: any = chain(coords)
            .groupBy(coord => {
              return moment(coord.timestamp).format('YYYY-MM-DD')
            })
            .map((group, keyGroup, coordsByDay) => {
              const color = randomColor({ luminosity: 'dark', format: 'rgb' })
              return _map(group as any, coord => {
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

      // Create a popup, but don't add it to the map yet.
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })

      this._map.on('mouseenter', 'userCoords', (e) => {
        // Change the cursor style as a UI indicator.
        this._map.getCanvas().style.cursor = 'pointer'

        const coordinates = e.features[0].geometry.coordinates.slice()
        const description = moment(e.features[0].properties.timestamp).format('YYYY-MM-DD')

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates)
          .setHTML(description)
          .addTo(this._map)
      })

      this._map.on('mouseleave', 'userCoords', () => {
        this._map.getCanvas().style.cursor = ''
        popup.remove()
      })

    })

  }

  ngOnDestroy () {
    this._userCoordsSubscription.unsubscribe()
    this._inputDateSubs.unsubscribe()
  }

  clickedMarker (e): void {
    console.log('Marcador clicckeado:', e)
  }

  closeModal () {
    this.activeModal.close()
  }

}

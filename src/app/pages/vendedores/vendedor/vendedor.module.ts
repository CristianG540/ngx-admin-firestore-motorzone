import { NgModule } from '@angular/core'
import { Ng2SmartTableModule } from 'ng2-smart-table'
import { AgmCoreModule } from '@agm/core'

import { ThemeModule } from '../../../@theme/theme.module'
import { VendedorComponent } from './vendedor.component'

import { SmartTableService } from '../../../@core/data/smart-table.service'
import { EnviromentService as env } from '../../../@core/data/enviroment.service'

import { MapaOrdenesComponent } from './mapa-ordenes/mapa-ordenes.component'
import { MapBoxOrdenesComponent } from './map-box-ordenes/map-box-ordenes.component'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    AgmCoreModule.forRoot({
      apiKey: env.G_MAPS_KEY
    })
  ],
  declarations: [
    VendedorComponent,
    MapaOrdenesComponent,
    MapBoxOrdenesComponent
  ],
  providers: [
    SmartTableService
  ],
  entryComponents: [
    MapaOrdenesComponent,
    MapBoxOrdenesComponent
  ]
})
export class VendedorModule { }

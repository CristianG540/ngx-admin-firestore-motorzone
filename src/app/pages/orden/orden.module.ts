import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AgmCoreModule } from '@agm/core';

import { ThemeModule } from '../../@theme/theme.module';
import { OrdenComponent } from './orden.component';

import { SmartTableService } from '../../@core/data/smart-table.service';
import { EnviromentService as env } from '../../@core/data/enviroment.service';

import { MapaModalComponent } from './mapa-modal/mapa-modal.component';

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule,
    AgmCoreModule.forRoot({
      apiKey: env.G_MAPS_KEY,
    }),
  ],
  declarations: [
    OrdenComponent,
    MapaModalComponent,
  ],
  providers: [
    SmartTableService,
  ],
  entryComponents: [
    MapaModalComponent,
  ],
})
export class OrdenModule { }

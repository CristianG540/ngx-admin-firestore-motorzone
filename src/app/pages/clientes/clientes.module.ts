import { NgModule } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ToasterModule } from 'angular2-toaster';
import { AgmCoreModule } from '@agm/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { BuscarClienteComponent } from './buscar-cliente/buscar-cliente.component';
import { MapaModalComponent } from './buscar-cliente/mapa-modal/mapa-modal.component';
import { ConsultarCarteraComponent } from './consultar-cartera/consultar-cartera.component';
import { MapaClientesComponent } from './mapa-clientes/mapa-clientes.component';

import { EnviromentService as env } from '../../@core/data/enviroment.service';

const components = [
  ClientesComponent,
  BuscarClienteComponent,
  ConsultarCarteraComponent,
  MapaClientesComponent,
  MapaModalComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    ClientesRoutingModule,
    Ng2SmartTableModule,
    ToasterModule,
    AgmCoreModule.forRoot({
      apiKey: env.G_MAPS_KEY,
    }),
  ],
  declarations: [
    ...components,
  ],
  entryComponents: [
    MapaModalComponent,
  ],
})
export class ClientesModule { }

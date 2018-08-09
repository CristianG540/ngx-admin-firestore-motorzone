import { NgModule } from '@angular/core'
import { Ng2SmartTableModule } from 'ng2-smart-table'

import { ThemeModule } from '../../@theme/theme.module'
import { VendedoresComponent } from './vendedores.component'

import { SmartTableService } from '../../@core/data/smart-table.service'

@NgModule({
  imports: [
    ThemeModule,
    Ng2SmartTableModule
  ],
  declarations: [
    VendedoresComponent
  ],
  providers: [
    SmartTableService
  ]
})
export class VendedoresModule { }

import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'

import { PagesComponent } from './pages.component'
import { DashboardComponent } from './dashboard/dashboard.component'
import { VendedoresComponent } from './vendedores/vendedores.component'
import { VendedorComponent } from './vendedores/vendedor/vendedor.component'
import { OrdenComponent } from './orden/orden.component'

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'dashboard',
      component: VendedoresComponent
    },
    {
      path: 'ordenes/:vendedor',
      component: VendedorComponent
    },
    {
      path: 'ordenes/:vendedor/:id',
      component: OrdenComponent
    },
    {
      path: 'clientes',
      loadChildren: './clientes/clientes.module#ClientesModule'
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full'
    }
  ]
}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {
}

import { Component } from '@angular/core'
import { LocalDataSource } from 'ng2-smart-table'
import { Router } from '@angular/router'

// Services
import { VendedorService } from '../../@core/data/vendedor/vendedor.service'
import { UtilsService } from '../../@core/utils/utils.service'

@Component({
  selector: 'ngx-vendedores',
  templateUrl: './vendedores.component.html'
})
export class VendedoresComponent {

  /**
   * objeto de configuracion para ng2-smart-table
   */
  private settings = {
    noDataMessage: 'No hay datos en este momento',
    actions : {
      add: false,
      edit : false,
      delete : false
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      vendedor: {
        title: 'Usuario',
        type: 'string'
      },
      idAsesor: {
        title: 'Id Asesor',
        type: 'html'
      },
      numOrdenes: {
        title: 'Ordenes',
        type: 'number'
      },
      numOrdenesErr: {
        title: 'Errores',
        type: 'html'
      },
      numOrdenesPend: {
        title: 'Pendientes',
        type: 'number'
      },
      numOrdenesVistas: {
        title: 'Revisados',
        type: 'html'
      }
    }
  }
  private source: LocalDataSource = new LocalDataSource()
  // Variable global de prettyprint
  private readonly PW = window['pleaseWait']

  constructor (
    private vendedoresService: VendedorService,
    private util: UtilsService,
    private router: Router
  ) {
    if (this.vendedoresService.lkIsLoaded) {
      this.source.load(this.vendedoresService.allOrdenesInfo)
    } else {
      // tslint:disable-next-line:variable-name
      const loading_screen: any = this.util.showPleaseWait()

      this.vendedoresService.initFirebase().then(res => {
        return this.vendedoresService.getOrdenesVendedores()
      }).then(res => {
        console.log('Consulta-Info Ordenes por vendedor', res)
        this.source.load(res)
        loading_screen.finish()
      }).catch(err => {
        loading_screen.finish()
        console.error('La puta madre no funciona', err)
      })
    }
  }

  private onUserRowSelect (evt): void {
    console.log('El buen evento', evt)
    this.router.navigate(['pages/ordenes', evt.data.vendedorData.uid], {
      queryParams: evt.data.vendedorData
    })
  }

  private reloadGrid (): void {
    window.location.reload()
    // tslint:disable-next-line:variable-name
    /*const loading_screen: any = this.util.showPleaseWait()
    this.vendedoresService.getOrdenesVendedores().then(res => {
      console.log('Consulta-Info Ordenes por vendedor', res)
      this.source.load(res)
      loading_screen.finish()
    }).catch(err => {
      loading_screen.finish()
      console.error('La puta madre no funciona', err)
    })*/
  }

}

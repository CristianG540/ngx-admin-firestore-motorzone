import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core'
import { NbSearchService } from '@nebular/theme'
import { Subscription } from 'rxjs/Subscription'
import { LocalDataSource, ViewCell } from 'ng2-smart-table'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { MapaModalComponent } from './mapa-modal/mapa-modal.component'
import { Router } from '@angular/router'
// Services
import { ClienteService } from '../../../@core/data/cliente/cliente.service'
// Models
import { Cliente } from '../../../@core/data/cliente/models/cliente'

@Component({
  selector: 'ngx-buscar-cliente',
  styleUrls: ['./buscar-cliente.component.scss'],
  templateUrl: 'buscar-cliente.component.html'
})
export class BuscarClienteComponent implements OnInit, OnDestroy {

  private onSearchSubmitSub: Subscription

  private source: LocalDataSource = new LocalDataSource()
  /**
   * objeto de configuracion para ng2-smart-table
   */
  private settings = {
    noDataMessage: 'No hay datos en este momento',
    actions : {
      columnTitle: 'Acciones',
      add: false,
      edit : false,
      delete : false,
      custom: [
        {
          name: 'gmap',
          title: '<i class="nb-location"></i>'
        },
        {
          name: 'cartera',
          title: '<i class="ion-clipboard"></i>'
        }
      ]
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
      _id: {
        title: 'NIT'
      },
      nombre_cliente: {
        title: 'Nombre'
      },
      telefono: {
        title: 'Telefono'
      },
      direccion: {
        title: 'Dirección'
      },
      ciudad: {
        title: 'Ciudad'
      },
      asesor_nombre: {
        title: 'Asesor'
      }
    }
  }

  constructor (
    private searchService: NbSearchService,
    private clienteServ: ClienteService,
    private modalService: NgbModal,
    private router: Router
  ) {
  }

  ngOnInit () {
    this.onSearchSubmitSub = this.searchService.onSearchSubmit()
      .subscribe((data: { term: string, tag: string }) => {
        console.log('Search cliente', data)
        this.clienteServ.searchCliente(data.term)
          .then((res: Cliente[]) => {
            console.log('La buena response', res)
            this.source.load(res)
          }).catch(err => {
            console.error('errror de mierda buscar clientes', err)
          })
      })
  }

  onCustom (event) {
    // alert(`Custom event '${event.action}' fired on row №: ${event.data._id}`);
    switch (event.action) {
      case 'gmap':
        this.showLargeModal(event.data)
        break
      case 'cartera':
        this.router.navigate(['pages/clientes/consultar-cartera'], { queryParams: { nit: event.data._id } })
        break
      default:
        break
    }
  }

  private showLargeModal (cliente: Cliente): void {
    const activeModal = this.modalService.open(MapaModalComponent, { size: 'lg', container: 'nb-layout' })
    activeModal.componentInstance.cliente = cliente
  }

  ngOnDestroy () {
    this.onSearchSubmitSub.unsubscribe()
  }

}

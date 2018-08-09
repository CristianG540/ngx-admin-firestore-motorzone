import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Location } from '@angular/common'
import { LocalDataSource } from 'ng2-smart-table'
import 'rxjs/add/operator/switchMap'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { MapaOrdenesComponent } from './mapa-ordenes/mapa-ordenes.component'
import Swal from 'sweetalert2'

// AngularFire - Firebase
import * as firebase from 'firebase'

// Services
import { VendedorService } from '../../../@core/data/vendedor/vendedor.service'
// Models
import { BasicInfoOrden } from '../../../@core/data/vendedor/models/basicInfoOrden'
import { Orden } from '../../../@core/data/orden/models/orden'

@Component({
  selector: 'ngx-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.scss']
})
export class VendedorComponent implements OnInit, OnDestroy {

  private _vendedor: string = ''
  private _IdAsesor: string = ''
  private _params: any
  private _paramsSub: Subscription
  private _ordenesGps: Orden[] = []

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
      id: {
        title: 'Id Orden',
        sortDirection: 'desc'
      },
      cliente: {
        title: 'Cliente NIT'
      },
      created_at: {
        title: 'Fecha'
      },
      total: {
        title: 'Total'
      },
      cantItems: {
        title: 'Items'
      },
      ubicacion: {
        title: 'Ubicacion',
        type: 'html'
      },
      estado: {
        title: 'Estado',
        type: 'html'
      }
    }
  }
  private source: LocalDataSource = new LocalDataSource()

  constructor (
    private vendedoresService: VendedorService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalService: NgbModal
  ) {}

  ngOnInit () {
    this._paramsSub = this.activatedRoute.queryParams.subscribe(params => {

      this._vendedor = params.name
      this._IdAsesor = params.idAsesor
      this.vendedoresService.bdName = params.uid
      this._params = params

      this.vendedoresService.formatOrdenesVendedor().then(res => {
        console.log('ordenes vendedor', res.ordenesInfo)
        this._ordenesGps = res.ordenesGps
        this.source.load(res.ordenesInfo)
      }).catch(err => {
        console.error('Me cago en la puta errror', err)
      })

    })
  }

  ngOnDestroy () {
    this._paramsSub.unsubscribe()
  }

  private onUserRowSelect (evt): void {
    console.log('El buen evento', evt)
    this.router.navigate(['pages/ordenes', this._params.uid, evt.data.id])
  }

  private back (): void {
    this.location.back()
  }

  private verUbicacion (): void {
    const activeModal = this.modalService.open(MapaOrdenesComponent, { size: 'lg', container: 'nb-layout' })
    activeModal.componentInstance.ordenes = this._ordenesGps
  }

  private async activarUsuario (): Promise<void> {
    const { value: idAsesor } = await Swal({
      title: 'Ingrese el ID del asesor',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        return !value && 'No puedes dejar el campo en blanco'
      }
    })

    if (idAsesor) {
      console.log('valor del pinche value', idAsesor)
      try {
        await this.vendedoresService.updateUserData({
          idAsesor : idAsesor
        })

        Swal({
          title: 'Activado!',
          text: 'El usuario ha sido activado con exito.',
          type: 'success'
        })

        this._IdAsesor = idAsesor
        this.vendedoresService.updateIdAsesor(this._params.email, idAsesor)
        this.location.back()

      } catch (error) {
        Swal({
          title: 'Error!',
          text: 'Ocurrio un error al activar el usuario.',
          type: 'error'
        })
        console.error('Error al activar el pinche usuario:', error)
      }
    }

  }

}

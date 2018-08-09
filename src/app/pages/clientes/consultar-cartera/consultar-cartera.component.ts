import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbSearchService } from '@nebular/theme';
import { Subscription } from 'rxjs/Subscription';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';

// Services
import { CarteraService } from '../../../@core/data/cartera/cartera.service';
import { UtilsService } from '../../../@core/utils/utils.service';
// Libs terceros
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';

@Component({
  selector: 'ngx-consultar-cartera',
  styleUrls: ['./consultar-cartera.component.scss'],
  templateUrl: 'consultar-cartera.component.html',
})
export class ConsultarCarteraComponent implements OnInit, OnDestroy {

  private onSearchSubmitSub: Subscription;
  private queryParamsSub: Subscription;

  private _config: ToasterConfig; // toatr config object
  private nitCliente: string = '';
  private totalCliente: number = 0;
  private source: LocalDataSource = new LocalDataSource();
  /**
   * objeto de configuracion para ng2-smart-table
   */
  private settings = {
    noDataMessage: 'No hay datos en este momento',
    actions : {
      add: false,
      edit : false,
      delete : false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      _id: {
        title: 'Id',
        sortDirection: 'desc',
      },
      valor: {
        title: 'Saldo',
      },
      valor_total: {
        title: 'Total',
      },
      fecha_emision: {
        title: 'Fecha de emisión',
      },
      fecha_vencimiento: {
        title: 'Fecha de vencimiento',
      },
    },
  };

  constructor(
    private toasterService: ToasterService,
    private searchService: NbSearchService,
    private carteraServ: CarteraService,
    private route: ActivatedRoute,
    private utils: UtilsService,
  ) {
  }

  ngOnInit() {
    this.onSearchSubmitSub = this.searchService.onSearchSubmit()
      .subscribe( (data: { term: string, tag: string }) => {
        console.log('a BER !!!!!', data);
        this.loadData(data.term);
      });

    this.queryParamsSub = this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}
        if (params.nit) {
          this.loadData(params.nit);
        }
      });

  }

  private showToast(type: string, title: string, body: string) {
    this._config = new ToasterConfig({
      positionClass: 'toast-top-right',
      timeout: 5000,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: false,
      animation: 'fade',
      limit: 5,
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: 5000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.toasterService.popAsync(toast);
  }

  private loadData(nitCliente: string) {
    this.nitCliente = nitCliente;
    this.carteraServ.searchCartera(nitCliente)
      .then( res => {
        if (res.length < 1) {
          this.showToast('warning', 'No hay resultados', 'El NIT que ingreso no existe o no tiene datos en cartera');
        }
        console.log(res);
        this.totalCliente = this.carteraServ.totalCliente;
        this.source.load(res);
      }).catch( err => {
        console.log('Error al buscar en cartera', err);
      });
  }

  ngOnDestroy() {
    this.onSearchSubmitSub.unsubscribe();
    this.queryParamsSub.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';

// Services
import { UtilsService } from '../../../@core/utils/utils.service';
import { ClienteService } from '../../../@core/data/cliente/cliente.service';
// Models
import { Cliente } from '../../../@core/data/cliente/models/cliente';

@Component({
  selector: 'ngx-mapa-clientes',
  styleUrls: ['./mapa-clientes.component.scss'],
  templateUrl: 'mapa-clientes.component.html',
})
export class MapaClientesComponent implements OnInit {

  private _lat: number = 4.0777137;
  private _lng: number = -70.6985415;
  private _zoom: number = 6;
  private _clientes: Cliente[] = [];

  constructor(
    private utils: UtilsService,
    private clienteServ: ClienteService,
  ) {
  }

  ngOnInit() {
    this.clienteServ.getCoordenadas()
      .then( (clientes: Cliente[]) => {
        console.log('clientes con cordenadas', clientes);
        this._clientes = clientes;
      }).catch(err => {
        console.error('Error al traer todas las cordenadas', err);
      });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, timeout } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';
// Libs terceros
import * as _ from 'lodash';
import * as moment from 'moment';
// Services
import { EnviromentService } from '../enviroment.service';
// Models
import { Cartera } from './models/cartera_mdl';

@Injectable()
export class CarteraService {

  private _totalCliente: number = 0;

  constructor(
    protected _env: EnviromentService,
    private http: HttpClient,
  ) {
  }

  /**
   * Esta funcion se encarga de buscar la cartera del cliente por el NIT
   * con el motor de busqueda lucene de cloudant, este metodo tambien hace
   * uso del api async/await de ecmascript 7 si no estoy mal
   *
   * @param {string} nitCliente
   * @returns {Promise<any>}
   * @memberof CarteraProvider
   */
  public async searchCartera(nitCliente: string): Promise<Cartera[]> {

    this._totalCliente = 0;

    const url: string = this._env.cartera.urlSearch;
    const params = new HttpParams()
      .set('q', `cod_cliente:"${nitCliente}"~`)
      .set('include_docs', 'true');
    const options = {
      headers: new HttpHeaders({
        'Accept'       : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization': 'Basic ' + btoa(`${this._env.cartera.userDB}:${this._env.cartera.passDB}`),
      }),
      params: params,
    };

    const res = await this.http.get( url, options ).pipe(
      map( (data: any) => {
        return _.map(data.rows, (row: any): Cartera => {
          this._totalCliente += parseInt(row.doc.valor, 10);
          row.doc.valor = parseInt(row.doc.valor, 10);
          row.doc.valor_total = parseInt(row.doc.valor_total, 10);
          row.doc.fecha_emision = moment(row.doc.fecha_emision).format('YYYY-MM-DD');
          row.doc.fecha_vencimiento = moment(row.doc.fecha_vencimiento).format('YYYY-MM-DD');
          return row.doc;
        });
      }),
      timeout(5000),
    ).toPromise();

    return res;
  }

  public get totalCliente(): number {
    return this._totalCliente;
  }

}


import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  // Variable global de PleaseWait.js
  private readonly PW = window['pleaseWait'];

  constructor() {
  }

  // Esta es una version mas rapida del "_.find" de lodash :3
  // Gracias a https://pouchdb.com/2015/02/28/efficiently-managing-ui-state-in-pouchdb.html
  public binarySearch(arr: any, property: string, search: any): number {
    let low: number = 0;
    let high: number = arr.length;
    let mid: number;
    while (low < high) {
      mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
      arr[mid][property] < search ? low = mid + 1 : high = mid;
    }
    return low;
  }

  /**
   * Esta funcion se encarga de mostrar una pantalla de carga
   * en la aplicacion
   *
   * @returns {*} Retorna un objeto que contiene la funcion "finish()"
   * al llamar la funcion finish la pantalla de carga se cierra
   * @memberof UtilsService
   */
  public showPleaseWait(): any {
    return this.PW({
      logo: 'https://www.igbcolombia.com/sites/default/files/202020.png',
      backgroundColor: '#24292e',
      // tslint:disable-next-line:max-line-length
      loadingHtml: `
      <p class="loading-message">Cargando, espere por favor...</p>
      <div class="sk-folding-cube">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
      </div>
      `,
    });
  }

}

import { Injectable } from '@angular/core'

@Injectable()
export class UtilsService {

  // Variable global de PleaseWait.js
  private readonly PW = window['pleaseWait']

  /**
   * Esta es una version mas rapida del "_.find" de lodash :3
   * Gracias a https://pouchdb.com/2015/02/28/efficiently-managing-ui-state-in-pouchdb.html
   * @static
   * @param {any[]} arr array de objetos donde voy a buscar wl valor
   * @param {string} property propiedad del objeto que contiene el valor q busco
   * @param {*} search lo que estoy buscando en el array
   * @param {boolean} [strict] si este parametro es verdadero la busqueda me devuelve error
   * si no encuentra el valor exacto que busco, de lo contrario me va a devolver el valor q mas se aproxime
   * @returns {number}
   * @memberof ConfigProvider
   */
  public binarySearch (arr: any[], property: string, search: any, strict?: boolean): number {
    let low: number = 0
    let high: number = arr.length
    let mid: number
    while (low < high) {
      mid = (low + high) >>> 1 // faster version of Math.floor((low + high) / 2)
      arr[mid][property] < search ? low = mid + 1 : high = mid
    }

    /**
     * lo que hago aqui es verificar si lo que busco en el array existe
     * por ejemplo si un array de productos estoy buscando el codigo "MF3021"
     * verifico que la posicion que me devuelve la funcion si sea la correcta
     * si no hago esto, lo que va a pasar es que si el codigo no exste en el array de prodcutos
     * la funcion me va a devolver el indice del codigo que mas se paresca
     */
    if (strict) {
      if (arr[low][property] === search) {
        return low
      } else {
        return 99999
      }
    }

    return low
  }

  /**
   * Esta funcion se encarga de mostrar una pantalla de carga
   * en la aplicacion
   *
   * @returns {*} Retorna un objeto que contiene la funcion "finish()"
   * al llamar la funcion finish la pantalla de carga se cierra
   * @memberof UtilsService
   */
  public showPleaseWait (): any {
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
      `
    })
  }

}

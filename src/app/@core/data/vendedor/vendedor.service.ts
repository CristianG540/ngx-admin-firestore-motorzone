import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Response } from '@angular/http/src/static_response'
import { Observable, combineLatest, Subject, BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import 'rxjs/add/operator/toPromise'

// Libs terceros
import * as _ from 'lodash'
import * as moment from 'moment'
import PouchDB from 'pouchdb'
import * as PouchUpsert from 'pouchdb-upsert'
import * as Loki from 'lokijs'

// AngularFire - Firestore
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore'
import * as firebase from 'firebase'

// Services
import { UtilsService } from '../../utils/utils.service'
// Models
import { AllOrdenesInfo } from './models/allOrdenesInfo'
import { BasicInfoOrden } from './models/basicInfoOrden'
import { Orden } from '../orden/models/orden'

@Injectable()
export class VendedorService {

  // Referencia a la coleccion de usuarios en firestore
  private usersRef: AngularFirestoreCollection<any>
  // id unico del usuario al que le voy a consultar las ordenes
  private _vendedor: string = ''
  /**
   * En esta variable guardo una instancia de lokiDB,
   * lo que hago mas o menos es gurdar en esta bd en memoria es un
   * array de objetos, cada uno de estos objetos tiene el nombre del
   * vendedor y una info basica sobre las ordenes de ese vendedor (vease la interfaz "AllOrdenesInfo")
   * Y me preguntare, para que mierda darme la molestia de usar una bd en memoria, bueno seria por esto
   * al tratar de recuperar la info de los vendedores y sus ordenes tengo que consultar diferentes BDS
   * en couchdb una por cada vendedor, lo que vuelve muy lenta la consulta, el truco aqui es consultar una vez
   * y almacenar los datos en loki, de esta forma no tengo que estar consultando a couchdb que se demora mucho
   */
  private _lkVendedorDB: Loki
  // Coleccion con la info de las ordens por cada vendedor
  private _lkOrdenesInfoTbl: Loki.Collection
  private _lkIsInit: boolean = false // Este atributo me sirve para verificar si ya cree la instancia de loki
  private _lkIsLoaded: boolean = false // Este atributo me sirve para verificar si ya se hizo la primera carga de datos
  /**
   * Guardo un array con los vendedores y sus ordenes
   * este array esta sujeto a un observador de firestore por lo que sus valores
   * son en tiempo real
   */
  public vendedores: any[]
  /**
   * Este subeject se encarga de informar a lo que se subscriba a el
   * cuando los datos de los usuarios estan listo
   */
  public vendedorServIsInit$: BehaviorSubject<any[] | null>

  constructor (
    private angularFirestoreDB: AngularFirestore,
    protected utils: UtilsService,
    private http: HttpClient
  ) {
    PouchDB.plugin(PouchUpsert)
    this._initLokiDB()
  }

  private _initLokiDB (): void {
    if (!this._lkIsInit) {
      this._lkVendedorDB = new Loki('ordenesInfoDB') // Creo la bd en loki
      // creo la coleccion que me va contener los datos
      this._lkOrdenesInfoTbl = this._lkVendedorDB.addCollection('ordenesInfo', {
        unique: ['vendedor']
      })
      this._lkIsInit = true
    }
  }

  public initFirebase (): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.usersRef = this.angularFirestoreDB.collection(`users/`)
      const ordenesObserv1 = this.usersRef.valueChanges().subscribe(
        users => {

          const userOrdenesObserv: Observable<any>[] = _.map(users, (user, userKey) => {
            const ordenesRef: AngularFirestoreCollection<any> = this.angularFirestoreDB.collection(`users/`).doc(user.uid).collection('orders')
            return ordenesRef.valueChanges().pipe(
              map(ordenes => {
                user.ordenes = ordenes
                return user
              })
            )
          })
          /**
           * El combine last es como el fork join, solo que este no espera a que la subscripciones terminen
           */
          combineLatest(userOrdenesObserv).subscribe(data => {
            console.log('cambios en el stream', data)
            this.vendedores = data
            resolve(data)
          },
          err => {
            console.error('"Error subscribe combineLatest users" - VendedorService|initFirebase() - /app/@core/vendedor/vendedor.service.ts', err)
            reject(err)
          })

        },
        err => {
          console.error('"Error subscribe users" - VendedorService|initFirebase() - /app/@core/vendedor/vendedor.service.ts', err)
          reject(err)
        }
      )
    })
  }

  public getOrdenesVendedor (ids?: string[]): any {

    console.log('vendedor infooo', this.vendedores)
    const keyVendedorthis = this.utils.binarySearch(this.vendedores, 'uid', this._vendedor)
    if (ids) {
      const newOrdenes = []
      const ordenes = this.vendedores[keyVendedorthis].ordenes
      for (const id of ids) {
        const ordenKey = this.utils.binarySearch(ordenes, '_id', id)
        newOrdenes.push(ordenes[ordenKey])
      }

      return {
        vendedor: this._vendedor,
        ordenes: newOrdenes
      }

    }
    return {
      vendedor: this._vendedor,
      ordenes: this.vendedores[keyVendedorthis].ordenes
    }
  }

  public formatOrdenesVendedor (): any {

    const ordenesUsuario = this.getOrdenesVendedor() // traigo todas las ordenes del vendedor
    const ordenesUbicacion: Orden[] = []

    const ordenes = _.map(ordenesUsuario.ordenes, (orden: any) => {
      // debugger
      if (_.has(orden, 'accuracy')) {
        ordenesUbicacion.push(orden)
      }

      let statusOrder: string = '<span class="badge badge-success">Procesado</span>' // row.doc.estado
      const hasntDocEntry: boolean = !_.has(orden, 'docEntry') || orden.docEntry === ''
      const hasError: boolean = _.has(orden, 'error') && orden.error
      if (hasntDocEntry) { statusOrder = '<span class="badge badge-warning">Pendiente</span>' }
      if (hasError) { statusOrder = '<span class="badge badge-danger">Error</span>' }
      if (String(orden.estado) === 'seen') { statusOrder = '<span class="badge badge-info">Revisado</span>' }
      if (String(orden.estado) === 'uploaded') { statusOrder = '<span class="badge badge-success">Procesado</span>' }
      // tslint:disable-next-line:max-line-length
      const ubicacion: string = _.has(orden, 'accuracy') ? '<span class="badge badge-success">Si</span>' : '<span class="badge badge-danger">No</span>'

      return {
        id         : orden._id,
        cliente    : orden.nitCliente,
        created_at : moment(parseInt(orden._id, 10)).format('YYYY-MM-DD'),
        total      : orden.total,
        cantItems  : orden.items.length,
        estado     : statusOrder,
        ubicacion  : ubicacion
      }
    })

    return {
      ordenesInfo: ordenes,
      ordenesGps: ordenesUbicacion
    }
  }

  /**
   * Esta funcion me devuleve un array de objetos, donde cada posicion corresponde
   * a un vendedor y la cantidad de ordenes que ha hecho, la cantidad de ordenes con errores
   * y la cantidad de ordenes pendientes y revisadas
   *
   * @returns {AllOrdenesInfo[]}
   * @memberof VendedorService
   */
  public getOrdenesVendedores (): AllOrdenesInfo[] {
    // limpio los datos de la coleccion para actualizarlos todos
    // tambien podria hacer un upsert, pero como en este caso
    // no estoy seguro de que valores cambiaron, entonces simplemente
    // vacio y creo toda la coneccion de nuevo para actualizarla
    // creo q asi gano un poco mas de performance
    this._lkOrdenesInfoTbl.clear()

    if (this.vendedores) {
      try {

        // tslint:disable-next-line:forin
        for (const vendedor of this.vendedores) {

          let htmlErrores = '0' // aqui guardo un html q basicamente en capsula el numero de errores en un badge
          const ordenesErr = [] // aqui guardo las ordenes que tienen errores de cada vendedor
          const ordenesPend = [] // aqui guardo las ordenes pendientes, osea las ordenes que aun no se han enviado a sap
          const ordenesVistas = [] // guardo las ordenes marcadas como vistas en la pag de administrador dio-brando

          if (vendedor.ordenes) {

            const ordenes = vendedor.ordenes
            // tslint:disable-next-line:forin
            for (const orden of ordenes) {
              /*
               * si un pedido no tiene docEntry esta variable pasa a ser "true",
               * el hecho de q un pedido no tenga docEntry casi siempre significa
               * que esta pendiente, no ha subido a sap
              */
              const hasntDocEntry: boolean = !_.has(orden, 'docEntry') || orden.docEntry === ''
              // si el pedido tiene un error esta variable pasa a true
              const hasError: boolean = _.has(orden, 'error') && orden.error
              // Verifico si la orden de la posicion actual tiene un error y la meto en el array respectivo
              if (hasError) {
                ordenesErr.push(orden)
              }
              // Verifico si la orden esta pendiente y no tiene errores
              if (hasntDocEntry && String(orden.estado) !== 'uploaded') {
                if (!hasError) {
                  ordenesPend.push(orden)
                }
              }
              // verifico si la orden esta marcada como vista
              if (String(orden.estado) === 'seen') { ordenesVistas.push(orden) }

            }

            if (ordenesErr.length - ordenesVistas.length > 0) {
              htmlErrores = `<span class="badge badge-danger">${ordenesErr.length - ordenesVistas.length}</span>`
            }

            this._lkOrdenesInfoTbl.insert({
              'vendedor': vendedor.email,
              'idAsesor': vendedor.idAsesor,
              'vendedorData': vendedor,
              'numOrdenes': Object.keys(ordenes).length,
              'numOrdenesErr': htmlErrores,
              'numOrdenesPend': ordenesPend.length,
              'numOrdenesVistas': ordenesVistas.length
            })

          } else {
            this._lkOrdenesInfoTbl.insert({
              'vendedor': vendedor.email,
              'idAsesor': vendedor.idAsesor ? vendedor.idAsesor : `<span class="badge badge-danger">Inactivo</span>`,
              'vendedorData': vendedor,
              'numOrdenes': 0,
              'numOrdenesErr': 0,
              'numOrdenesPend': 0,
              'numOrdenesVistas': 0
            })
          }

        }

      } catch (err) {
        console.error('error al recuperar las ordenes de los vendedores', err)
        window.alert('Error al recuperar las ordenes de los vendedores')
      }

      return this.allOrdenesInfo
    }

    return []

  }

  public updateUserData (data): Promise<void> {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestoreDB.doc<any>(`users/${this._vendedor}`)
    return userRef.update(data)
  }

  public async cambiarEstado (idDoc: string, estado: string): Promise<any> {

    const ordenRef: AngularFirestoreDocument<any> = this.angularFirestoreDB.collection(`users/`).doc(this._vendedor).collection('orders').doc(idDoc)

    if (estado === 'uploaded') {
      return await ordenRef.update({
        updated_at: Date.now().toString(),
        estado: estado,
        error: ''
      })
    }

    return await ordenRef.update({
      updated_at: Date.now().toString(),
      estado: estado
    })

  }

  public async eliminarOrden (idDoc: string): Promise<any> {
    /*
    const res = await this._remoteBD.upsert(idDoc, (orden: any) => {
      orden._deleted = true
      return orden
    })

    return res
    */
    console.log('Metodo deprecado')
  }

  public set bdName (v: string) {
    this._vendedor = v
  }

  public get lkIsInit (): boolean {
    return this._lkIsInit
  }

  public get allOrdenesInfo (): AllOrdenesInfo[] {
    return this._lkOrdenesInfoTbl.find()
  }

}

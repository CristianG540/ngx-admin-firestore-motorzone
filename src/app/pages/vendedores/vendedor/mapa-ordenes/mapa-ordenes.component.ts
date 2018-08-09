import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// Models
import { Orden } from '../../../../@core/data/orden/models/orden';

@Component({
  selector: 'ngx-mapa-ordenes',
  styleUrls: ['./mapa-ordenes.component.scss'],
  templateUrl: 'mapa-ordenes.component.html',
})
export class MapaOrdenesComponent implements OnInit {

  @Input() private ordenes: Orden[] = [];
  private _lat: number = 4.0777137;
  private _lng: number = -70.6985415;
  private _zoom: number = 6;

  constructor(
    private activeModal: NgbActiveModal,
  ) {
  }

  ngOnInit() {
    console.log('ordenes mapa', this.ordenes);
  }

  clickedMarker(e): void {
    console.log('Marcador clicckeado:', e);
  }

  closeModal() {
    this.activeModal.close();
  }

}

import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Orden } from '../../../@core/data/orden/models/orden';

@Component({
  selector: 'ngx-mapa-modal',
  templateUrl: './mapa-modal.component.html',
  styleUrls: ['./mapa-modal.component.scss'],
})
export class MapaModalComponent {

  @Input() private orden: Orden;
  private zoom: number = 17;

  constructor(
    private activeModal: NgbActiveModal,
  ) {}

  closeModal() {
    this.activeModal.close();
  }
}

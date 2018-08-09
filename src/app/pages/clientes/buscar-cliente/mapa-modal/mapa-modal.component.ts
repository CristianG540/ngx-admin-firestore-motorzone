import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from '../../../../@core/data/cliente/models/cliente';

@Component({
  selector: 'ngx-mapa-modal',
  templateUrl: './mapa-modal.component.html',
  styleUrls: ['./mapa-modal.component.scss'],
})
export class MapaModalComponent {

  @Input() private cliente: Cliente;

  constructor(
    private activeModal: NgbActiveModal,
  ) {}

  closeModal() {
    this.activeModal.close();
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-item-modal',
  templateUrl: './item-modal.component.html',
  styleUrls: ['./item-modal.component.scss'],
})
export class ItemModalComponent implements OnInit {
  @ViewChild('inlineModal') inlineModal!: ModalController
  @Output() modalOpenChange: EventEmitter<boolean> =  new EventEmitter<boolean>()
  @Input() modalOpen: boolean;
  @Input() item: Item | null; // package to show informatin to
  constructor() { }

  ngOnInit() {}


  
// when dismiss function of modal is called
dismiss($event: any) {
  this.modalOpen = false;
  this.modalOpenChange.emit(this.modalOpen);
  console.log('Dismiss inside modal component');
}

// dismiss Modal manually
dismissManually() {
  this.inlineModal.dismiss({
    dismissed: true
  });
  this.modalOpen = false;
  this.modalOpenChange.emit(this.modalOpen);
  console.log('Manual-Dismiss inside modal component');
}

}

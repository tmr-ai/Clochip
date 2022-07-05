import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Item } from 'src/app/models/item';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'responseType': 'text'
  })
};

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
  constructor(private http:HttpClient) { }

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


  washingDegreeFormatter(value: number) {
    return `${value}°C`;
  }

  spinningFormatter(value: number) {
    switch(value) {
      case 1: return 0
      case 2: return 400
      case 3: return 800
      case 4: return 1200
    }
  }

  save(item: Item) {
    this.http.post<any>('https://gabler.tech:3000/updateItem', item, httpOptions).subscribe(data => {
      console.log(data)
    })
  }
}

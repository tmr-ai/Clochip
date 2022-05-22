import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Item } from '../models/item';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tab-inventory',
  templateUrl: 'tab-inventory.page.html',
  styleUrls: ['tab-inventory.page.scss']
})
export class TabInventoryPage implements OnInit {
  lstInventory: Item[]
  chosenItem: Item
  private modalOpen = false;

  constructor(private http:HttpClient) {}

  ngOnInit() {
      this.loadInventory()
  }

  loadInventory() {
    this.getItems().subscribe( data => {
      this.lstInventory = data
      console.log(this.lstInventory)
    });
  }
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>('http://gabler.tech:3000/api/item/all?idUser='+environment.idTestuser)
  }

  openModal(item: Item): void {
    this.chosenItem = item
    this.modalOpen = true;
  }

}

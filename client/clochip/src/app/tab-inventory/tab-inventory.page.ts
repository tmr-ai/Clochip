import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Item } from '../models/item';
import { Buffer } from 'buffer'

@Component({
  selector: 'app-tab-inventory',
  templateUrl: 'tab-inventory.page.html',
  styleUrls: ['tab-inventory.page.scss']
})
export class TabInventoryPage implements OnInit {
  lstInventory: Item[]
  lstInventorySave: Item[]
  chosenItem: Item
  private modalOpen = false;
  nmbFilter

  constructor(private http:HttpClient) {}

  ngOnInit() {
    this.refresh()
  }

  refresh() {
    this.loadInventory()
  }

  loadInventory() {
    this.getItems().subscribe( data => {
      this.lstInventory = data
      this.lstInventorySave = data
      for(let i of this.lstInventory) {
        if(i.blobImage == null) {
          i.blobImage = "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
        } else {
          i.blobImage = Buffer.from(i.blobImage, 'base64').toString()
        }

      }
      this.sortList()
      console.log(this.lstInventory)
    });
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>('https://gabler.tech:3000/itemByUser/withImage?fidUser='+environment.idTestuser)
  }

  openModal(item: Item): void {
    this.chosenItem = item
    this.modalOpen = true;
  }

  markAsFavorite(item: Item) {
    item.blnFavorite = true

    let tmpObj = { idItem: item.idItem }
    this.http.post<any>('https://gabler.tech:3000/markAsFavorite', tmpObj).subscribe(data => { })

    this.sortList()
  }

  unmarkAsFavorite(item: Item) {
    item.blnFavorite = false
    this.sortList()

    let tmpObj = { idItem: item.idItem }
    this.http.post<any>('https://gabler.tech:3000/unmarkAsFavorite', tmpObj).subscribe(data => { })
  }

  markAsDirty(item: Item) {
    item.blnDirty = true

    let tmpObj = { idItem: item.idItem }
    this.http.post<any>('https://gabler.tech:3000/markAsDirty', tmpObj).subscribe(data => { })
  }

  unmarkAsDirty(item: Item) {
    item.blnDirty = false

    let tmpObj = { idItem: item.idItem }
    this.http.post<any>('https://gabler.tech:3000/unmarkAsDirty', tmpObj).subscribe(data => { })
  }

  remove(item: Item) {
    let tmpObj = { idItem: item.idItem }
    this.http.post<any>('https://gabler.tech:3000/remove', tmpObj).subscribe(data => { })

    this.lstInventory.splice(this.lstInventory.indexOf(item), 1)
  }

  sortList() {
    this.lstInventory.sort(({ blnFavorite: stateA = false }, { blnFavorite: stateB = false }) =>
      Number(stateB) - Number(stateA)
    );
  }

  filter() {
    this.lstInventory = new Array()

    switch(this.nmbFilter) {
      case "0": //all
        for(let item of this.lstInventorySave) {
          this.lstInventory.push(item)
        }
        break;
      case "11": //favorites
        for(let item of this.lstInventorySave) {
          if(item.blnFavorite)
            this.lstInventory.push(item)
        }
        break;
      case "12": //dirty
        for(let item of this.lstInventorySave) {
          if(item.blnDirty)
            this.lstInventory.push(item)
        }
        break;
      case "13": //clean
        for(let item of this.lstInventorySave) {
          if(!item.blnDirty)
            this.lstInventory.push(item)
        }
        break;
      case "21": //top
        for(let item of this.lstInventorySave) {
          if(item.setType == 'T-Shirt' || item.setType == 'Knitwear' || item.setType == 'Jacket' || item.setType == 'Hoodie' || item.setType=='Sweatshirt' || item.setType == 'Shirt')
            this.lstInventory.push(item)
        }
        break;
      case "22": //bottom
        for(let item of this.lstInventorySave) {
          if(item.setType == 'Jeans' || item.setType == 'Chinos' || item.setType == 'Trousers' || item.setType == 'Shorts')
            this.lstInventory.push(item)
        }
        break;
      case "31": //cold
        for(let item of this.lstInventorySave) {
          if(item.enumWeather == 'Cold')
            this.lstInventory.push(item)
        }
        break;
      case "32": //warm
        for(let item of this.lstInventorySave) {
          if(item.enumWeather == 'Warm')
            this.lstInventory.push(item)
        }
        break;
      case "33": //hot
        for(let item of this.lstInventorySave) {
          if(item.enumWeather == 'Hot')
            this.lstInventory.push(item)
        }
        break;
        default:
          console.log('fail')
    }
  }
}

import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Item } from '../models/item';
import { Buffer } from 'buffer'

@Component({
  selector: 'app-tab-favorites',
  templateUrl: 'tab-favorites.page.html',
  styleUrls: ['tab-favorites.page.scss']
})
export class TabFavoritesPage {
  lstInventory: Item[]
  chosenItem: Item
  private modalOpen = false;

  constructor(private http:HttpClient) {}

  ngOnInit() {
      this.refresh()
  }

  refresh() {
    console.log('sdlökfjh')
    this.loadInventory()
  }

  loadInventory() {
    this.getItems().subscribe( data => {
      this.lstInventory = data
      for(let i of this.lstInventory) {
        if(i.blobImage == null) {
          i.blobImage = "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
        } else {
          i.blobImage = Buffer.from(i.blobImage, 'base64').toString()
        }

      }
      console.log(this.lstInventory)
    });
  }
  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>('https://gabler.tech:3000/favoritesByUser/withImage?fidUser='+environment.idTestuser)
  }

  openModal(item: Item): void {
    this.chosenItem = item
    this.modalOpen = true;
  }

}

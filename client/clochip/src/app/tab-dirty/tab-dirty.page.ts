import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Item } from '../models/item';
import { Buffer } from 'buffer'
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab-dirty',
  templateUrl: './tab-dirty.page.html',
  styleUrls: ['./tab-dirty.page.scss'],
})
export class TabDirtyPage implements OnInit {

  private modalOpen = false;
  chosenItem: Item
  lstInventory: Item[]
  lstInventorySave: Item[]
  checkArray: boolean[]
  recommendationMsg = ''
  checkedItems = []

  constructor(private http:HttpClient, public alertController: AlertController) { }

  onChange(item) {
    // If a selected item gets deselected it gets removed from the array
    if (this.checkedItems.includes(item)) {
      var num = this.checkedItems.indexOf(item)
      this.checkedItems.splice(num, 1)
    } else {
      // If the item gets selected it gets added to the array of selected items
      this.checkedItems.push(item)
    }
   }

  ngOnInit() {
    this.refresh()
  }

  refresh() {
    this.loadInventory()
  }

  loadInventory() {
    this.getItems().subscribe( data => {
      this.lstInventory = data
      console.log(this.lstInventory)
      this.lstInventorySave = data
      for(let i of this.lstInventory) {
        if(i.blobImage == null) {
          i.blobImage = "https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
        } else {
          i.blobImage = Buffer.from(i.blobImage, 'base64').toString()
        }
      }
      this.sortList()
      this.lstInventory.forEach(element => {

      });
    });
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>('https://gabler.tech:3000/dirtyByUser/withImage?fidUser='+environment.idTestuser)
  }

  sortList() {
    this.lstInventory.sort(({ blnFavorite: stateA = false }, { blnFavorite: stateB = false }) =>
      Number(stateB) - Number(stateA)
    );
  }

  openModal(item: Item): void {
    this.chosenItem = item
    this.modalOpen = true;
  }

  // needed to format spinning recommendation
  spinningFormatter(value: number) {
    switch(value) {
      case 0: return 0
      case 1: return 0
      case 2: return 400
      case 3: return 800
      case 4: return 1200
    }
  }

  async presentAlert() {

    var itemList = this.checkedItems

    const temperature = []
    const spinningCycles = []
    const colors = []
    const materials = []

    for(let i = 0; i < itemList.length; i ++) {

      temperature.push(itemList[i].nmbTemperature)
      spinningCycles.push(itemList[i].nmbSpinningCycles)
      colors.push(itemList[i].setColor)
      materials.push(itemList[i].setMaterial)

    }

    // now compute min temp and spinning cycle
    const minTemp = Math.min.apply(Math, temperature)
    const minSpinningCycle = Math.min.apply(Math, spinningCycles)

    var notes = ''

    // white exist and its count is greater than 1 which means white is mixed with colors
    if (colors.includes('white') && Array.from(new Set(colors)).length > 1) {
      notes = 'Attention: You are mixing white clothes with colored ones, maybe use a color catch cloth<br/>'
    }
    // if whool or leather is detected, warn user
    if (materials.includes('Wool') || materials.includes('leather')) {
      notes += 'Attention: You have an delicate item in your laundry, consider hand washing it'
    }

    // if note is still not set, everything is good
    if (!notes) {
      notes = 'Looks good, you can start washing'
    }

    this.recommendationMsg = "Tempterature: " + minTemp + "<br/>Spinning cycles: " + this.spinningFormatter(minSpinningCycle) + "<br/> " + notes

    const alert = await this.alertController.create({
      header: 'Recommendation',
      message: this.recommendationMsg,
      buttons: ['OK']
    });

    await alert.present();
    const result = await alert.onDidDismiss()
    console.log(result)
  }

}

import { Component } from '@angular/core';
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { Device } from '@capacitor/device';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { Item } from '../models/item';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  flags = null
  tag = null
  loader = null
  openCreateModal = false
  detected = false
  isSubmitted = false
  currentId = null
  initialFormInputs = null
  writeSomeData = null

  formInputs = {
    name: {
      value: '',
      error: false,
    },
    description: {
      value: '',
      error: false
    },
    topOrBottom: {
      value: '',
      error: false
    },
    color: {
      value: '#000',
      error: false,
      options: ['black', 'brown', 'beige', 'grey', 'white', 'blue', 'petrol', 'green', 'yellow', 'orange', 'red', 'pink', 'gold', 'silver']
    },
    size: {
      value: '',
      error: false
    },
    fit: {
      value: '',
      error: false
    },
    condition: {
      value: '',
      error: false
    },
    weather: {
      value: '',
      error: false
    },
    material: {
      value: '',
      error: false
    },
    temperature: {
      value: '50',
      error: false
    },
    spinningCycles: {
      value: '0',
      error: false
    },
    photo: {
      value: null,
      error: false
    }
  }

  constructor(
    private nfc: NFC,
    private ndef: Ndef,
    private http: HttpClient,
    public alertController: AlertController,
    public loadingController: LoadingController
    ) {
      this.initialFormInputs = JSON.parse(JSON.stringify(this.formInputs))
  }

  async presentLoading(message) {
    this.loader = await this.loadingController.create({
      message,
    });
    await this.loader.present();
  }

  markAsDirty(id) {
  // send id of dirty item to api
    let tmpObj = { idItem: id }
    this.http.post(environment.apiUrl + '/markAsDirty', tmpObj).subscribe((response) => {
        //alert('markAsDirty api -> ' + JSON.stringify(response));
      }, (err) => {
        alert('markAsDirty api -> ' + JSON.stringify(err))
      });
  }

  unmarkAsDirty(id) {
  // send id of clean item to api

    let tmpObj = { idItem: id }
    this.http.post(environment.apiUrl + '/unmarkAsDirty', tmpObj).subscribe((response) => {
        //alert('unmarkAsDirty api -> ' + JSON.stringify(response));
      }, (err) => {
        alert('unmarkAsDirty api -> '  + JSON.stringify(err))
      });
  }

  async performOperation() {
    this.formInputs = JSON.parse(JSON.stringify(this.initialFormInputs))
    // check if payload exist (if not tag is empty)
    if (
      this.tag.ndefMessage &&
      this.tag.ndefMessage.length &&
      this.tag.ndefMessage.length > 0 &&
      this.tag.ndefMessage[0].payload
    ) {
      //alert('Written Tag detected, ID is: ' + JSON.stringify(this.nfc.bytesToString(this.tag.ndefMessage[0].payload)))
      // ask if its dirty or not
      const dirtyOrNotResult = await this.getDirtyOrNot()

      if (dirtyOrNotResult) {
        //alert('Your choice: ' + dirtyOrNotResult)

        const tagId = this.nfc.bytesToString(this.tag.ndefMessage[0].payload)

        // call the api
        if (dirtyOrNotResult === 'dirty') {
          this.markAsDirty(tagId)
        } else {
          this.unmarkAsDirty(tagId)
        }
      }
    } else {
      alert('Tag is empty!')
      // tag is empty, create new id
      this.currentId = uuidv4()
      //alert('New payload generated: ' + this.currentId.toString())

      if (this.tag.isWritable) {
        this.writeSomeData = null
        this.openCreateModal = true
      } else {
        alert('Error: NFC tag is not writable!')
      }
    }
  }

  async getDirtyOrNot() {
    // altert pop up, ask user if item is diry or not
    var result = ''
    const alert = await this.alertController.create({
      header: 'Is item dirty ?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            result = 'dirty'
          }
        },
        {
          text: 'No',
          handler: () => {
            result = 'clean'
          }
        }
      ]
    });

    await alert.present();
    const { role } = await alert.onDidDismiss();
    return result
  }

  async readNfc() {
    const info = await Device.getInfo();

    this.detected = false

    // store data as initial form. Have you JSON to use new object reference
    this.formInputs = JSON.parse(JSON.stringify(this.initialFormInputs))

    await this.presentLoading('Scanning NFC...')

    if (info.platform === 'android') {
      this.nfc.addNdefListener((s) => {
      }, (err) => {
        alert('Error in starting NFC reader: ' + JSON.stringify(err))
      }).subscribe((res) => {
        if (this.detected) {
          //removeListener function is removed in this NFC package
          return
        }
        //alert(JSON.stringify(res))

        this.loader.dismiss()
        this.detected = true

        if (this.writeSomeData) {
          this.openCreateModal = false
          alert('Starting to write to nfc!')
          this.nfc.write(this.writeSomeData).then((res) => {
            // create the form for new item input (new modal)
            //alert('New data is written to tag')
          }).catch((err) => {
            alert('Issue in writing to NFC')
          }).finally(()=> {
            alert('Writing was sucessful')

            // make all variables as initial state form
            this.currentId = null
            this.openCreateModal = false
            this.writeSomeData = null
            this.detected = false
          })
        } else {
          this.tag = res.tag
          this.performOperation()
        }
      }, (e) => {
        alert('Error from subs' + JSON.stringify(e))
        this.loader.dismiss()
      }, () => {
      });
    } else {
      this.loader.dismiss()
      alert('NFC support not available, use phone')
    }
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

  async clickPhoto() {
    // use camere to make image
    this.formInputs.photo.value = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 95,
      allowEditing: false,
      width: 340,
      height: 340
    });
    this.formInputs.photo.error = false
    this.formInputs.photo.value = `data:image/${this.formInputs.photo.value.format};base64,${this.formInputs.photo.value.base64String}`
  }

  submitForm() {
    // transform form to item than submit it to api
    this.isSubmitted = true;
    let errorCount = 0
    for (let key in this.formInputs) {
      if (this.formInputs[key].value === '' || this.formInputs[key].value === null) {
        this.formInputs[key].error = true
        errorCount += 1
      } else {
        this.formInputs[key].error = false
      }
    }
    if (errorCount > 0) {
      alert('Fill all required fields')
      return false
    }

    var newData = {
      id: this.currentId,
      createdAt: new Date().toISOString(),
      lastScannedAt: new Date().toISOString(),
      isDirtyBool: null,
      isFavouriteBool: null
    }

    for (let key in this.formInputs) {
      newData[key] = this.formInputs[key].value
    }

    const item = new Item()

    item.idItem = this.currentId
    //item.tsCreated = newData.createdAt
    item.fidUser = environment.idTestuser
    item.setColor = [newData['color']]
    item.enumCondition = newData['condition']
    //item.tsChanged = newData.createdAt
    //item.tsLastRead = newData.createdAt
    item.txtName = newData['name']
    item.txtDescription = newData['description']
    item.txtSize = newData['size']
    item.enumCut = newData['fit']
    item.setMaterial = [newData['material']]
    item.setType = newData['topOrBottom']
    item.txtSetColor = newData['color']
    item.txtSetMaterial = newData['material']
    item.txtSetType = newData['topOrBottom']
    item.blnDirty = false
    item.blnFavorite = false
    item.blobImage = this.formInputs.photo.value
    item.enumWeather = newData['weather']

    item.nmbTemperature = newData['temperature']
    item.nmbSpinningCycles = newData['spinningCycles']

    // now lets push to api
    //alert('item looks like ' + JSON.stringify(item))

    // store new item in backend
    this.http
      .post(environment.apiUrl + '/insertItem', item)
      .subscribe((response) => {
        //alert(JSON.stringify(response))
        console.log(response);
      }, (err) => {
        alert(JSON.stringify(err))
        console.log(err)
      });

    // now write the info/uuid to tag
    try {
      var message = [
        this.ndef.mimeMediaRecord('text/plain', this.currentId.toString()),
      ];
    } catch(e) {
      //alert(JSON.stringify(e))
    }
    this.detected = false
    this.writeSomeData = message
    this.readNfc()

    return true
  }

  closeModal() {
    // close form
    this.formInputs = JSON.parse(JSON.stringify(this.initialFormInputs))
    this.openCreateModal = false
  }
}

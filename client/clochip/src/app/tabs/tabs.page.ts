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
  openCreateModal = true
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

    let tmpObj = { idItem: id }
    this.http.post(environment.apiUrl + '/markAsDirty', tmpObj).subscribe(data => { })
  }

  unmarkAsDirty(id) {
    let tmpObj = { idItem: id }
    this.http.post(environment.apiUrl + '/unmarkAsDirty', tmpObj).subscribe(data => { })
  }

  async performOperation() {
    this.formInputs = JSON.parse(JSON.stringify(this.initialFormInputs))
    // check if payload exist with nDefMessage
    if (
      this.tag.ndefMessage &&
      this.tag.ndefMessage.length &&
      this.tag.ndefMessage.length > 0 &&
      this.tag.ndefMessage[0].payload
    ) {
      alert('Payload detected: ' + JSON.stringify(this.tag.ndefMessage[0].payload))
      // get if its dirty or not
      const dirtyOrNotResult = await this.getDirtyOrNot()
      console.log(dirtyOrNotResult)
      if (dirtyOrNotResult) {
        alert('Your choice: ' + dirtyOrNotResult)
        // now store in local database for now (later mysql api)
        var tags = []
        try {
          tags = JSON.parse(localStorage.getItem('clothes')) || []
        } catch(e) {
          tags = []
        }
        const tagId = this.nfc.bytesToHexString(this.tag.id)
        // call the api
        if (dirtyOrNotResult === 'dirty') {
          this.markAsDirty(tagId)
        } else {
          this.unmarkAsDirty(tagId)
        }
        alert('Local db count: ' + tags.length.toString())
        var newDetails = {
          id: tagId,
          lastScannedAt: new Date().toISOString(),
          isDirtyBool: dirtyOrNotResult,
        }
        tags.push(newDetails)
        localStorage.setItem('clothes', JSON.stringify(tags))
        alert('Local db updated with new entry: ' + JSON.stringify(newDetails))
      }
    } else {
      alert('Tag is empty!')
      // no payload ask server for new
      // this.currentId = new Date().getTime()
      this.currentId = uuidv4()
      alert('New payload generated: ' + this.currentId.toString())

      if (this.tag.isWritable) {
        this.writeSomeData = null
        this.openCreateModal = true
      } else {
        alert('NFC tag is not writable!')
      }
    }
  }

  async getDirtyOrNot() {
    var result = ''
    const alert = await this.alertController.create({
      header: 'Is it dirty ?',
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

    await this.presentLoading('Scanning NFC...')

    if (info.platform === 'android') {
      this.nfc.addNdefListener((s) => {
      }, (err) => {
        alert('Error in starting NFC reader: ' + JSON.stringify(err))
      }).subscribe((res) => {
        if (this.detected) {
          // if the only tag is detected dont move ahead. removeListener function is removed in this NFC package
          return
        }
        alert(JSON.stringify(res))
        this.loader.dismiss()
        this.detected = true
        if (this.writeSomeData) {
          this.formInputs = JSON.parse(JSON.stringify(this.initialFormInputs))
          this.openCreateModal = false
          alert('starting to write to nfc!')
          this.nfc.write(this.writeSomeData).then((res) => {
            // create the form for input (new modal)
            alert('New data is written to tag')
          }).catch((err) => {
            alert('Issue in writing to NFC')
          }).finally(()=> {
            alert('Now we are done')
            this.currentId = null
            this.formInputs = JSON.parse(JSON.stringify(this.initialFormInputs))
            this.openCreateModal = false
            this.writeSomeData = null
            this.detected = false
          })
        } else {
          this.tag = res.tag
          this.performOperation()
        }
      }, (e) => {
        alert('err from subs' + JSON.stringify(e))
        this.loader.dismiss()
      }, () => {
      });
    } else {
      this.loader.dismiss()
      alert('NFC support not available')
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
    this.formInputs.photo.value = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 80,
      allowEditing: false,
    });
    this.formInputs.photo.error = false
    this.formInputs.photo.value = `data:image/${this.formInputs.photo.value.format};base64,${this.formInputs.photo.value.base64String}`
    console.log(this.formInputs.photo)
  }

  submitForm() {
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
      alert('Fill required fields')
      return false
    }

    console.log(this.formInputs)
    // get local db
    var data = []
    try {
      data = JSON.parse(localStorage.getItem('data')) || []
    } catch(e) {
      data = []
    }

    var newData = {
      id: this.currentId,
      createdAt: new Date().toISOString(),
      lastScannedAt: new Date().toISOString(),
      isDirtyBool: null,
      isFavouriteBool: null
    }

    for (let key in this.formInputs) {
      console.log(this.formInputs[key].value)
      newData[key] = this.formInputs[key].value
    }

    data.push(newData)
    localStorage.setItem('data', JSON.stringify(data))
    alert('Local db updated with new entry: ' + JSON.stringify(newData))


    const item = new Item()

    item.blnFavorite = false
    item.enumWeather = "Warm"
    item.fidUser =  "0e6f825b-da02-11ec-acec-0050563de962"
    item.idItem = "c30db6be-b5ab-4514-ba3d-c7aeabe32d18"
    item.nmbSpinningCycles = 2
    item.nmbTemperature = 65
    item.setColor = ['black']
    item.setMaterial = ['Cashmere']
    item.setType = "T-Shirt"
    item.txtDescription = "Test"
    item.txtName = "Test"
    item.txtSetColor = "black"
    item.txtSetMaterial = "Cashmere"
    item.txtSetType = ""
    item.txtSize = "M"

    //item.idItem = this.currentId
    //item.tsCreated = newData.createdAt
    //item.fidUser = environment.idTestuser
    //item.setColor = [newData['color']]
    //item.enumCondition = newData['condition']
    //item.tsChanged = newData.createdAt
    //item.tsLastRead = newData.createdAt
    //item.txtName = newData['name']
    //item.txtDescription = newData['description']
    //item.txtSize = newData['size']
    //item.enumCut = newData['fit']
    //item.setMaterial = [newData['material']]
    //item.setType = newData['type']
    //item.txtSetColor = newData['color']
    //item.txtSetMaterial = newData['material']
    //item.txtSetType = newData['type']
    //item.blnDirty = null
    //item.blnFavorite = null
    //item.blobImage = this.formInputs.photo.value
    //item.enumWeather = newData['weather']

    //item.nmbTemperature = newData['temperature']
    //item.nmbSpinningCycles = newData['spinningCycles']

     console.log(item)

    // now lets push to api
    this.http
      .post(environment.apiUrl + '/insertItem', item)
      .subscribe((response) => {
        alert(JSON.stringify(response))
        console.log(response);
      }, (err) => {
        alert(JSON.stringify(err))
        console.log(err)
      });
    // now write this info on the tag
    try {
      var message = [
        this.ndef.mimeMediaRecord('text/plain', this.currentId.toString()),
      ];
    } catch(e) {
      alert(JSON.stringify(e))
    }
    this.detected = false
    this.writeSomeData = message
    this.readNfc()

    return true
  }

  closeModal() {
    this.formInputs = JSON.parse(JSON.stringify(this.initialFormInputs))
    this.openCreateModal = false
  }
}

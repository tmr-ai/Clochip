import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Item } from '../models/item';
import { Buffer } from 'buffer'
//import {AgmMap, MouseEvent,MapsAPILoader  } from '@agm/core'; 

@Component({
  selector: 'app-tab-favorites',
  templateUrl: 'tab-favorites.page.html',
  styleUrls: ['tab-favorites.page.scss']
})
export class TabFavoritesPage implements OnInit{

  // weather variables
  lati: number;
  long: number;
  API_KEY = 'ff1bc4683fc7325e9c57e586c20cc03e';
  //API_URL = "https://api.openweathermap.org/data/2.5/weather?lat={" + this.lat + "} }&lon={" + this.lon+ "}&appid={ff1bc4683fc7325e9c57e586c20cc03e}";
  WeatherData: any;

  //inventory variables
  public lstInventory: Item[]
  lstInventorySave: Item[]
  lstTshirt: Item[]
  public lstShirt: Item[]
  lstHoodie: Item[]
  lstLongPants: Item[]
  lstShort: Item[]
  lstJacket: Item[]
  chosenItem: Item
  nmbFilter

  //suggestion variables
  public shirt: Item[]
  public tshirt: Item[]
  public hoodie: Item[]
  public pants: Item[]
  public shorts: Item[]
  public jacket: Item[]

  public displayShirt: Item[]
  public displayTshirt: Item[]
  public displayHoodie: Item[]
  public displayPants: Item[]
  public displayShorts: Item[]
  public displayJacket: Item[]

  suggestionList: Item[]

  constructor(private http:HttpClient) { }

  //start on page initiation
  ngOnInit() {
    this.WeatherData = {
      main : {},
      isDay: true
    };

    this.getPosition().subscribe(pos => {
      this.lati = pos.coords.latitude
      this.long = pos.coords.longitude
      this.getWeatherData(pos.coords.latitude, pos.coords.longitude)
   });
   
   //this.getWeatherData(this.lati, this.long)
   this.loadInventory();
  }

  // get current position
  getPosition(): Observable<any> {
    return Observable.create(observer => {
      window.navigator.geolocation.getCurrentPosition(position => {
        observer.next(position);
        observer.complete();
      },
        error => observer.error(error));
    });
  }

  //get weather data from api
  getWeatherData(lat, lon) {
    console.log(this.lati)
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + this.API_KEY + '&units=metric')
    //fetch('https://api.openweathermap.org/data/2.5/weather?lat=' + this.lati + '&lon=' + this.long + '&appid=' + this.API_KEY + '&units=metric')
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})
  }

  //save all weather variables for use and display
  setWeatherData(data) {
    this.WeatherData = data
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date()
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    //temperature
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp).toFixed(0);
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like).toFixed(0);
    //windspeed
    this.WeatherData.speed = (this.WeatherData.wind.speed);
    //weather description
    this.WeatherData.desc = (this.WeatherData.weather.main);
    this.WeatherData.description = (this.WeatherData.weather.description);
    //clouds
    this.WeatherData.clouds = (this.WeatherData.clouds.all);
    //sunset
    this.WeatherData.sunset = new Date(this.WeatherData.sys.sunset * 1000).toLocaleTimeString();
    this.WeatherData.sunrise = new Date(this.WeatherData.sys.sunrise * 1000).toLocaleTimeString();
    //rain
    //this.WeatherData.rain1h = (this.WeatherData.rain.rain.1h);
    //this.WeatherData.rain3h = (this.WeatherData.rain.rain.3h);
    //snow
    //this.WeatherData.snow1h = (this.WeatherData.snow.snow.1h);
    //this.WeatherData.snow3h = (this.WeatherData.snow.snow.3h);
  }

   //load inventory
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
      this.selectClothes(data)
    });
  }

  //check weather and filter clothes based on needs
  selectClothes(data) {

    this.suggestionList = new Array()
    //conditions:
      //rain: jacket
      //below 10: jacket + tschirt + pullover/hoodie + pants
      // 10 - 20: shirt + pullover + pants
      // 20+ shirt + shorts

    console.log("enter selectClothes")


    if(this.WeatherData.temp_celcius  < 10) {

      console.log("Weather <10")

      //this.nmbFilter = "6" //jacket
      this.suggestionList.push(this.suggestion(this.filter("6", data)));
      //this.nmbFilter = "1" //tshirt
      this.suggestionList.push(this.suggestion(this.filter("1", data)));
      //this.nmbFilter = "3" //pullover/hoodie
      this.suggestionList.push(this.suggestion(this.filter("3", data)));
     // this.nmbFilter = "4" //long pants
     this.suggestionList.push(this.suggestion(this.filter("4", data)));
      
     console.log(this.suggestionList)
    } 
    
    else if (this.WeatherData.temp_celcius >= 10 && this.WeatherData.temp_celcius <= 20) {

      console.log("Weather 10-20")

      //this.nmbFilter = "2" //shirt
      //this.shirt = 
      this.suggestionList.push((this.suggestion(this.filter("2", data))));
      console.log("Shirt: " + this.shirt)
      //this.nmbFilter = "3" //pullover/hoodie
      this.suggestionList.push(this.suggestion(this.filter("3", data)));
      //this.nmbFilter = "4" //long pants
      this.suggestionList.push(this.suggestion(this.filter("4", data)));
      console.log(this.suggestionList)
    } 
    
    else if (this.WeatherData.temp_celcius > 20) {

      console.log("Weather 20+")

      //this.nmbFilter = "1" //tshirt
      this.suggestionList.push(this.tshirt = this.suggestion(this.filter("1", data)));
      //this.nmbFilter = "5" //shorts
      this.suggestionList.push(this.shorts = this.suggestion(this.filter("5", data)));
      
    } else (console.log("selectClothes error"));

  }

  suggestion(data) {
    var selection = data[Math.floor(Math.random()*data.length)]
    return selection;
  }

  //get correct image for weather widget
  defineWeatherAndDay() {
    //need rain/sun info for that
  }

  //blobImage
  //enumWeather
  //fidItem
  //fidUser
  //idItem
  //setType

  // make get request for all items from backend
  getItems(): Observable<Item[]> {
    console.log("getting items...")
    return this.http.get<Item[]>('https://gabler.tech:3000/itemByUser/withImage?fidUser='+environment.idTestuser)
  }

  //filter the items based on weather condition
  filter(caseNumber, data) {
    console.log("enter filter")

    this.lstInventory = new Array()

    switch(caseNumber) {
      // cases for recommending one piece per category depending on weather
      case "1": // t-shirt
        for(let item of data) {
          if(item.setType == 'T-Shirt')
            this.lstInventory .push(item)
        }
        break;

      case "2": // shirt
        for(let item of data) {
          if(item.setType == 'Shirt' )
            this.lstInventory .push(item)
        }
        break;  

      case "3": // pullover or hoodie
        for(let item of data) {
          if(item.setType == 'Knitwear' || item.setType == 'Hoodie' || item.setType=='Sweatshirt')
          this.lstInventory .push(item)
        }
        break;    

      case "4": // long pants
        for(let item of data) {
          if(item.setType == 'Jeans' || item.setType == 'Chinos' || item.setType == 'Trousers')
          this.lstInventory .push(item)
        }
        break;    
      
      case "5": // short pants
        for(let item of data) {
          if(item.setType == 'Shorts')
          this.lstInventory .push(item)
        }
        console.log("filter Shorts")
        break;   
      
      case "6": // jacket
        for(let item of data){
          this.lstInventory .push(item)
        }
        break;   

      // standard cases giving back pieces belonging to category  
      case "7": //top
        for(let item of this.lstInventorySave) {
          if(item.setType == 'T-Shirt' || item.setType == 'Knitwear' || item.setType == 'Jacket' || item.setType == 'Hoodie' || item.setType=='Sweatshirt' || item.setType == 'Shirt')
          this.lstInventory .push(item)
        }
        break;
      case "8": //bottom
        for(let item of this.lstInventorySave) {
          if(item.setType == 'Jeans' || item.setType == 'Chinos' || item.setType == 'Trousers' || item.setType == 'Shorts')
            this.lstInventory.push(item)
        }
        break;
      case "9": //cold
        for(let item of this.lstInventorySave) {
          if(item.enumWeather == 'Cold')
            this.lstInventory.push(item)
        }
        break; 
      case "10": //warm
        for(let item of this.lstInventorySave) {
          if(item.enumWeather == 'Warm')
            this.lstInventory.push(item)
        }
        break;
      case "11": //hot
        for(let item of this.lstInventorySave) {
          if(item.enumWeather == 'Hot')
            this.lstInventory.push(item)
        }
        break;
        default:
          console.log('fail')
    }

    return this.lstInventory;
  }

  refresh() {
    this.loadInventory();
  }

}

import { Component } from '@angular/core';
import { CarJson } from 'src/model/car_list'  


interface JSONResult {
  result: Car[];
}

interface Car {
  brand: string;
  model: string;
  year: number;
  images?: CarImages;
  attribution?: string[];
}

interface CarImages {
  bigDetailImage: string[];
  smallDetailImage: string[];
  fullPicture: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'proj';

  jsonResult: JSONResult = CarJson;
  carList: Car[] = this.jsonResult.result;

  challengeLevel: number = 0;
  onInputChange(event: Event) {
    
    this.challengeLevel = (event.target as HTMLInputElement).valueAsNumber
    
  }

}

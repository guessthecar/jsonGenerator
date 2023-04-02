import { Component } from '@angular/core';
import { CarJson } from 'src/model/car_list'
import { Pipe, PipeTransform } from '@angular/core';



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

enum QuizType {

  none = "",
  full = "INTERA",
  smallDetail = "DETTAGLIO PICCOLO",
  bigDetail = "DETTAGLIO GRANDE"

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
  correctCar: Car | undefined;
  optionsCar: Car[] = [];

  challengeLevel: number = 0;
  quizType: QuizType = QuizType.none;
  query: any;


  onInputChange(event: Event) {

    this.challengeLevel = (event.target as HTMLInputElement).valueAsNumber

  }

  challengeSelected(): Boolean {

    return this.challengeLevel != 0;

  }

  quizTypeSelected(): Boolean {

    return this.quizType != QuizType.none;

  }

  isTheRight(car: Car) {
    return car == this.correctCar;
  }

  isInTheOptions(car: Car) {
    return this.optionsCar.indexOf(car) != -1;
  }

  markRight(event: any) {
    var target = event.target || event.srcElement || event.currentTarget;
    var car = target.parentElement.parentElement.parentElement;
    var modello = car.dataset.modello;
    var anno = car.dataset.anno

    this.correctCar = this.carList.find(c => c.model == modello && c.year == anno);



  }

  markOption(event: any) {
    var target = event.target || event.srcElement || event.currentTarget;
    var car = target.parentElement.parentElement.parentElement;
    var modello = car.dataset.modello;
    var anno = car.dataset.anno

    var carToAdd = this.carList.find(c => c.model == modello && c.year == anno);
    //Controllare se già presente in array
    if (carToAdd != null) {
      if (this.optionsCar.length >= 3) {
        this.optionsCar.shift();
      }
      this.optionsCar.push(carToAdd);
    }

  }

}


@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  public transform(value: any, keys: string, term: string) {

    if (!term) return value;
    return (value || []).filter((item: any) => {
      return keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key]));
    });

  }
}
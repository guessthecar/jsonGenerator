import { Component, Query, inject } from '@angular/core';
import { CarJson } from 'src/model/car_list'
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Database, push, ref } from '@angular/fire/database';
import { Observable } from 'rxjs';



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

interface Quiz {
  difficoltà: number,
  tipoImmagine: QuizType,
  rispostaCorretta: Car | undefined,
  opzioni: Car[]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'proj';

  jsonResult: JSONResult = CarJson;
  carList: Car[] = this.jsonResult.result;
  correctCar: Car | undefined;
  optionsCar: Car[] = [];
  quizCreated: Quiz | undefined;
  quizList = new Observable<Quiz[]>();

  challengeLevel: number = 0;
  quizType: QuizType = QuizType.none;
  query: any;
  downloadJsonHref: any;

  private db: Database = inject(Database);

  constructor(private sanitizer: DomSanitizer) { }


  onInputChange(event: Event) {

    this.challengeLevel = (event.target as HTMLInputElement).valueAsNumber
  
  }

  challengeSelected(): Boolean {

    return this.challengeLevel != 0;

  }

  quizTypeSelected(): Boolean {
    return this.quizType != QuizType.none;
  }
  correctCarSelected(): Boolean {
    return this.correctCar != null;
  }

  optionsCarNotEmpty(): Boolean {
    return this.optionsCar.length > 0;
  }

  optionsCarReady(): Boolean {
    return this.optionsCar.length == 3;
  }

  completeButtonVisible(): Boolean {
   
    return this.optionsCarReady() && this.correctCarSelected() && this.quizTypeSelected() && this.challengeSelected();

  }

  thereAreQuiz(): Boolean {
    return this.quizCreated != undefined;
  }

  isTheRight(car: Car) {
    return car == this.correctCar;
  }

  isInTheOptions(car: Car) {
    return this.optionsCar.indexOf(car) != -1;
  }

  emptyAll() {
    //TODO: Quado resetto il challange levelo si deve svuotare aggiornare lo slider in view
    this.challengeLevel = 0;
    this.quizType = QuizType.none;
    this.correctCar = undefined;
    this.optionsCar = [];
  }

  markRight(event: any) {
    var target = event.target || event.srcElement || event.currentTarget;
    var car = target.parentElement.parentElement.parentElement;
    var modello = car.dataset.modello;
    var anno = car.dataset.anno

    this.correctCar = this.carList.find(c => c.model == modello && c.year == anno);

    //Controllo se la macchina era tra le opzioni
    if (this.optionsCar.length > 0 && this.correctCar != null && this.isInTheOptions(this.correctCar)) {
      this.optionsCar.splice(this.optionsCar.indexOf(this.correctCar), 1);
    }

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

    //Controllo se la macchina precedentemente era la macchina corretta
    if (this.correctCar != null && this.correctCar == carToAdd) {
      this.correctCar = undefined;
    }

  }

  generateDownloadJsonUri() {
    var quiz: Quiz = {
      difficoltà: this.challengeLevel,
      tipoImmagine: this.quizType,
      rispostaCorretta: this.correctCar,
      opzioni: this.optionsCar
    }
    this.emptyAll();
    this.quizCreated = quiz;
    var theJSON = JSON.stringify(this.quizCreated);
    var uri = this.sanitizer.bypassSecurityTrustUrl("data:text/json;charset=UTF-8," + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;
  }

  uploadJson() {

    var dbRef = ref(this.db, 'quizList');

    push(dbRef, this.quizCreated);
    this.quizCreated = undefined;

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
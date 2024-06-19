import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgOptimizedImage } from '@angular/common'
import { FormsModule } from '@angular/forms';

import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { SearchPipe } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyA6aBdM3sz0ucK20ojwf5bFNZ1SZ7Dd9I0",
    authDomain: "guess-the-car-83303.firebaseapp.com",
    databaseURL: "https://guess-the-car-83303-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "guess-the-car-83303",
    storageBucket: "guess-the-car-83303.appspot.com",
    messagingSenderId: "991796508239",
    appId: "1:991796508239:web:6e93d172b4a003efc71c3a",
    measurementId: "G-LF68D1M7HX"
  }
};

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatSelectModule,
    NgOptimizedImage,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import {LOCALE_ID, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { MainpageComponent } from './component/mainpage/mainpage.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AuthInterceptor } from "./service/AuthInterceptor";
import {DATE_PIPE_DEFAULT_TIMEZONE} from "@angular/common";

@NgModule({
    declarations: [
        AppComponent,
        MainpageComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        {
            provide: DATE_PIPE_DEFAULT_TIMEZONE,
            useValue: 'fr-FR'
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

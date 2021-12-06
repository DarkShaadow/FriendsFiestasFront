import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainpageComponent} from './component/mainpage/mainpage.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptor} from "./service/AuthInterceptor";
import { LoginComponent } from './component/account/login/login.component';
import { RegisterComponent } from './component/account/register/register.component';
import { CreerSalonComponent } from './component/creer-salon/creer-salon.component';
import { AjouterUtilisateurComponent } from './component/ajouter-utilisateur/ajouter-utilisateur.component';

@NgModule({
    declarations: [
        AppComponent,
        MainpageComponent,
        LoginComponent,
        RegisterComponent,
        CreerSalonComponent,
        AjouterUtilisateurComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

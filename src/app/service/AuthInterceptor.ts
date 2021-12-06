import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var token = localStorage.getItem("token");

        if (!token) {
            return next.handle(req);
        }

        const req1 = req.clone({
            headers: req.headers.set("Authorization", "Bearer " + token).set("Access-Control-Allow-Origin", "*")
        });

        return next.handle(req1);
    }
}

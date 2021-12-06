import {Injectable} from "@angular/core";
import {Service} from "./Service";
import {User} from "../model/User";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../model/ApiResponse";

@Injectable({
    providedIn: 'root'
})
export class UserService extends Service<User> {

    constructor(private httpClient: HttpClient) {
        super("api/v1/friends-fiestas/users");

        console.log("User service : " + this.url);
    }

    findAll() {
        this.httpClient.get<ApiResponse>(this.url)
            .subscribe(
                (response) => {
                    this.list = response.data;
                    this.emit();
                }
            )
    }

    async register(user: User): Promise<ApiResponse | undefined> {
        return await this.httpClient.post<ApiResponse>(this.url + "/register", {
            "pseudo": user.pseudo,
            "email": user.email,
            "password": user.password
        }).toPromise();
    }

    async login(user: User): Promise<ApiResponse | undefined> {
        return await this.httpClient.post<ApiResponse>(this.url + "/login", {
            "pseudo": user.pseudo,
            "password": user.password
        }).toPromise();
    }

    async loginTest(): Promise<ApiResponse | undefined> {
        return await this.httpClient.post<ApiResponse>(this.url + "/login", {
            "pseudo": "Wamuu",
            "password": "motdepasse"
        }).toPromise();
    }
}

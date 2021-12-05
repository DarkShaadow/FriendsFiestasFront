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
  }

  findAll() {
    this.httpClient.get<ApiResponse<User[]>>(this.url)
      .subscribe(
        (response) => {
          this.list = response.data;
          this.emit();
        }
      )
  }

  async register(user: User): Promise<ApiResponse<any> | undefined> {
    return await this.httpClient.post<ApiResponse<any>>(this.url + "/register", {
      "pseudo": user.pseudo,
      "email": user.email,
      "password": user.password
    }).toPromise();
  }

  async login(user: User): Promise<ApiResponse<any> | undefined> {
    return await this.httpClient.post<ApiResponse<any>>(this.url + "/login", {
      "pseudo": user.pseudo,
      "email": user.email,
      "password": user.password
    }).toPromise();
  }
}

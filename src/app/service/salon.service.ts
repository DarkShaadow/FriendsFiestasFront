import {Injectable} from '@angular/core';
import {Service} from "./Service";
import {Response} from "../model/Response";
import {Salon} from "../model/Salon";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SalonService extends Service<Salon> {

  constructor(private httpClient: HttpClient) {
    super("api/v1/friends-fiestas/salons");
  }

  findAll() {
    this.httpClient.get<Response<Salon[]>>(this.url)
      .subscribe(
        (response) => {
          this.list = response.data;
          this.emit();
        }
      )
  }

  async getById(id: number): Promise<Response<Salon> | undefined> {
    return await this.httpClient.get<Response<Salon>>(this.url + "/" + id.toString()).toPromise();
  }

  async add(salon: Salon): Promise<Response<Salon> | undefined> {
    return await this.httpClient.post<Response<Salon>>(this.url + "/ajouter", {
      "name": salon.name,
      "adresse": salon.adresse,
      "description": salon.description,
      "host": salon.host.id,
      "dateEvent": salon.dateEvent,
      "coverImage": salon.coverImage
    }).toPromise();
  }

  async update(salon: Salon): Promise<Response<Salon> | undefined> {
    return await this.httpClient.put<Response<Salon>>(this.url + "/modifier/" + salon.id.toString(), {
      "name": salon.name,
      "adresse": salon.adresse,
      "description": salon.description,
      "host": salon.host.id,
      "dateEvent": salon.dateEvent,
      "coverImage": salon.coverImage
    }).toPromise();
  }

  delete(id: number) {
    this.httpClient.delete(this.url + "/supprimer/" + id.toString());
  }
}

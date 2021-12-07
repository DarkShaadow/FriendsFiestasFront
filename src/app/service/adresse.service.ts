import {Injectable} from "@angular/core";
import {Service} from "./Service";
import {Adresse} from "../model/Adresse";
import {HttpClient} from "@angular/common/http";
import {ApiResponse} from "../model/ApiResponse";

@Injectable({
    providedIn: 'root'
})
export class AdresseService extends Service<Adresse> {

    constructor(private httpClient: HttpClient) {
        super("api/v1/friends-fiestas/adresses");
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

    async getById(id: number): Promise<ApiResponse | undefined> {
        return await this.httpClient.get<ApiResponse>(this.url + "/" + id.toString()).toPromise();
    }

    async add(adresse: Adresse): Promise<ApiResponse | undefined> {
        return await this.httpClient.post<ApiResponse>(this.url + "/ajouter", {
            "street": adresse.street,
            "postalCode": adresse.postalCode,
            "city": adresse.city
        }).toPromise();
    }

    async update(adresse: Adresse): Promise<ApiResponse | undefined> {
        return await this.httpClient.put<ApiResponse>(this.url + "/modifier/" + adresse.id.toString(), {
            "street": adresse.street,
            "postalCode": adresse.postalCode,
            "city": adresse.city
        }).toPromise();
    }

    async delete(id: number) {
        return await this.httpClient.delete(this.url + "/supprimer/" + id.toString()).toPromise();
    }
}

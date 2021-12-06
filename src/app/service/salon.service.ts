import {Injectable} from '@angular/core';
import {Service} from "./Service";
import {ApiResponse} from "../model/ApiResponse";
import {Salon} from "../model/Salon";
import {HttpClient} from "@angular/common/http";
import {Adresse} from "../model/Adresse";
import {Task} from "../model/Task";
import {User} from "../model/User";

@Injectable({
    providedIn: 'root'
})
export class SalonService extends Service<Salon> {

    constructor(private httpClient: HttpClient) {
        super("api/v1/friends-fiestas/salons");
    }

    findAll() {
        this.httpClient.get<ApiResponse>(this.url + "/")
            .subscribe(
                (response) => {
                    this.list = response.data?.salons;
                    this.emit();
                }
            )
    }

    findAllSalonsByIdHost(id: number) {
        this.httpClient.get<ApiResponse>(this.url + "/mes-salons/" + id.toString())
            .subscribe(
                (response) => {
                    this.list = response.data?.salons;
                    this.emit();
                }
            )
    }

    async getById(id: number): Promise<ApiResponse | undefined> {
        return await this.httpClient.get<ApiResponse>(this.url + "/" + id.toString()).toPromise();
    }

    async add(salon: Salon): Promise<ApiResponse | undefined> {
        return await this.httpClient.post<ApiResponse>(this.url + "/ajouter", {
            "name": salon.name,
            "adresse": salon.adresse,
            "description": salon.description,
            "host": salon.host.id,
            "dateEvent": salon.dateEvent,
            "coverImage": salon.coverImage
        }).toPromise();
    }

    async update(salon: Salon): Promise<ApiResponse | undefined> {
        return await this.httpClient.put<ApiResponse>(this.url + "/modifier/" + salon.id.toString(), {
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

    ajouterAdresse(salon: Salon, adresse: Adresse) {
        this.httpClient.post(this.url + "/" + salon.id + "/ajouter-adresse", {
            "street": adresse.street,
            "postalCode": adresse.postalCode,
            "city": adresse.city
        });
    }

    updateAdresse(salon: Salon, adresse: Adresse) {
        this.httpClient.put(this.url + "/" + salon.id + "/modifier-adresse/" + adresse.id, {
            "street": adresse.street,
            "postalCode": adresse.postalCode,
            "city": adresse.city
        });
    }

    ajouterTask(salon: Salon, task: Task) {
        this.httpClient.post(this.url + "/" + salon.id + "/ajouter-tache", {
            "description": task.description
        });
    }

    ajouterMemberToSalon(salon: Salon, userId: number) {
        this.httpClient.get(this.url + "/" + salon.id + "/ajouter-membre/" + userId, {});
    }

    validerTache(salon: Salon, user: User, task: Task) {
        this.httpClient.put(this.url + "/" + salon.id + "/membre/" + user.id + "/valider-tache/" + task.id, {});
    }

    affectMemberToTask(salon: Salon, user: User, task: Task) {
        this.httpClient.get(this.url + "/" + salon.id + "/taches/" + task.id + "/membre/" + user.id);
    }

    addMessage(salon: Salon, user: User, message: string) {
        this.httpClient.post(this.url + "/" + salon.id + "/membre/" + user.id + "/ajouter-message", {
            "message": message
        });
    }
}

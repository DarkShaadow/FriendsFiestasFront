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

    findAllSalonsByIdUser(id: number) { // FIXME A revoir
        this.httpClient.get<ApiResponse>(this.url + "/mes-salons/" + id.toString())
            .subscribe(
                (response) => {
                    this.list = response.data?.salons;
                    this.emit();
                }
            )
    }

    async getById(id: number) {
        return await this.httpClient.get<ApiResponse>(this.url + "/" + id.toString()).toPromise();
    }

    async add(salon: Salon) {
        return await this.httpClient.post<ApiResponse>(this.url + "/ajouter", {
            "name": salon.name,
            "addressEvent": salon.addressEvent,
            "description": salon.description,
            "host": salon.host.id,
            "dateEvent": salon.dateEvent,
            "tasks": salon.tasks,
            "members": salon.members
        }).toPromise();
    }

    async update(salon: Salon) {
        return await this.httpClient.put<ApiResponse>(this.url + "/modifier/" + salon.id.toString(), {
            "name": salon.name,
            "addressEvent": salon.addressEvent,
            "description": salon.description,
            "host": salon.host.id,
            "dateEvent": salon.dateEvent,
            "tasks": salon.tasks,
            "members": salon.members
        }).toPromise();
    }

    async delete(id: number) {
        return await this.httpClient.delete(this.url + "/supprimer/" + id.toString()).toPromise();
    }

    async ajouterAdresse(idSalon: number, adresse: Adresse) {
        return await this.httpClient.post(this.url + "/" + idSalon.toString() + "/ajouter-adresse", {
            "street": adresse.street,
            "postalCode": adresse.postalCode,
            "city": adresse.city
        }).toPromise();
    }

    async updateAdresse(salon: Salon, adresse: Adresse) {
        return await this.httpClient.put(this.url + "/" + salon.id + "/modifier-adresse/" + adresse.id, {
            "street": adresse.street,
            "postalCode": adresse.postalCode,
            "city": adresse.city
        }).toPromise();
    }

    async ajouterTask(salon: Salon, task: Task) {
        return await this.httpClient.post(this.url + "/" + salon.id + "/ajouter-tache", {
            "description": task.description
        }).toPromise();
    }

    async ajouterMemberToSalon(salon: Salon, userId: number) {
        return await this.httpClient.get(this.url + "/" + salon.id + "/ajouter-membre/" + userId, {}).toPromise();
    }

    async validerTache(salon: Salon, user: User, task: Task) {
        return await this.httpClient.put(this.url + "/" + salon.id + "/membre/" + user.id + "/valider-tache/" + task.id, {}).toPromise();
    }

    async affectMemberToTask(salon: Salon, user: User, task: Task) {
        return await this.httpClient.get(this.url + "/" + salon.id + "/taches/" + task.id + "/membre/" + user.id).toPromise();
    }

    async addMessage(salon: Salon, user: User, message: string) {
        return await this.httpClient.post(this.url + "/" + salon.id + "/membre/" + user.id + "/ajouter-message", {
            "message": message
        }).toPromise();
    }
}

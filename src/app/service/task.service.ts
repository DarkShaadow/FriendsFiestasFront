import {Injectable} from "@angular/core";
import {Service} from "./Service";
import {Task} from "../model/Task";
import {HttpClient, HttpParams} from "@angular/common/http";
import {ApiResponse} from "../model/ApiResponse";

@Injectable({
    providedIn: 'root'
})
export class UserService extends Service<Task> {

    constructor(private httpClient: HttpClient) {
        super("api/v1/friends-fiestas/taches");
    }

    findAll() {
        this.httpClient.get<ApiResponse<Task[]>>(this.url)
            .subscribe(
                (response) => {
                    this.list = response.data;
                    this.emit();
                }
            )
    }

    async getById(id: number): Promise<ApiResponse<Task> | undefined> {
        return await this.httpClient.get<ApiResponse<Task>>(this.url + "/" + id.toString()).toPromise();
    }

    async update(task: Task): Promise<ApiResponse<Task> | undefined> {
        return await this.httpClient.put<ApiResponse<Task>>(this.url + "/modifier/" + task.id, {
            "description": task.description
        }).toPromise();
    }

    delete(id: number) {
        this.httpClient.delete(this.url + "/supprimer/" + id);
    }
}

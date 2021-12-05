import {Subject} from "rxjs";

export class Service<T> {
    subjectList = new Subject<T[]>();
    protected url = "http://localhost:8080/";
    protected list: T[] = [];

    constructor(private urlApi: string) {
        this.url = this.url + urlApi;
    }

    emit() {
        this.subjectList.next(this.list.slice());
    }
}

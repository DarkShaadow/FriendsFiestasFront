import {Adresse} from "./Adresse";
import {User} from "./User";
import {Task} from "./Task";
import {Member} from "./Member";

export class Salon {
    constructor(public id: number,
                public name: string,
                public description: string,
                public dateEvent: Date,
                public host: User,
                public addressEvent: Adresse,
                public tasks: Task[],
                public members: Member[]) {
    }
}

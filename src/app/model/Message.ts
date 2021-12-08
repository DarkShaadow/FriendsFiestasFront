import {Member} from "./Member";
import {User} from "./User";

export class Message {
    constructor(public idMember: number,
                public user: User,
                public content: string,
                public sendAt: Date) {
    }
}

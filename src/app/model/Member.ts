import {Salon} from "./Salon";
import {User} from "./User";
import {Presence} from "./Presence";

export class Member {
    constructor(public salon: Salon,
                public user: User,
                public presence: Presence) {
    }
}

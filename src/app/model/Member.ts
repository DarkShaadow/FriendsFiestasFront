import {Salon} from "./Salon";
import {User} from "./User";

export class Member {
  constructor(public salon : Salon,
              public user : User,
              public presence : Presence) {
  }
}

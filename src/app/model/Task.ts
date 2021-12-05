import {User} from "./User";

export class Task {
  constructor(public id : number,
              public description : string,
              public affectedUser : User) {
  }
}

import {User} from "./User";

export class Task {
  constructor(public id : number,
              public content : string,
              public affectedUser : User) {
  }
}

import {Adresse} from "./Adresse";
import {User} from "./User";

export class Salon {
  constructor(public id : number,
              public name : string,
              public description : string,
              public coverImage : ImageBitmap,
              public dateEvent : Date,
              public host : User,
              public adresse : Adresse) {
  }
}

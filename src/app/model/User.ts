import {TypeUser} from "./TypeUser";

export class User {
    constructor(public id: number,
                public pseudo: string,
                public email: string,
                public password: string,
                public profilePicture: ImageBitmap,
                public typeUser: TypeUser) {
    }
}

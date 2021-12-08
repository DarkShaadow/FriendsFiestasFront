import {Member} from "./Member";

export class Task {
    constructor(public id: number,
                public description: string,
                public affectedMember: Member | undefined,
                public done: boolean) {
    }
}

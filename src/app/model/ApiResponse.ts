export class ApiResponse<T> {
    constructor(public status: string,
                public message: string,
                public dataName: string,
                public data: T) {
    }
}

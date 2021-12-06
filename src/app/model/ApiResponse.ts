export class ApiResponse {
    constructor(public status: string,
                public message: string,
                public dataName: string,
                public data: any) {
    }
}

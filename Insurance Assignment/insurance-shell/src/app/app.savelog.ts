import { HttpClient } from "@angular/common/http";

export class SaveLogInDb{
    constructor(private http: HttpClient){}

    saveToDb(data: any) : any{
        return this.http.post('http://localhost:3001/savedLogs',data);
    }
}
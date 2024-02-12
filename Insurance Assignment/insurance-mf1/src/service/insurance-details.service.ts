import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class InsuranceDetailsService {

  private storageUrl = environment.dbUrl;
  private insuranceDetails: any;

  constructor(private http: HttpClient) {}

  getInsuranceDetails(): Observable<any[]> {
    return this.http.get<any[]>(this.storageUrl);
  }

  updateInsuranceDetails(paidPremiumInformation: any): Observable<any> {
    const updateUrl = `${this.storageUrl}/${paidPremiumInformation.id}`;
    return this.http.put(updateUrl, paidPremiumInformation);
  }
}

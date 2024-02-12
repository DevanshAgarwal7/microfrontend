import { AfterViewInit, Component } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IPremiumDetails } from 'src/model/ipremium-details';
import { ISendDetails } from 'src/model/isend-details';
import { InsuranceDetailsService } from 'src/service/insurance-details.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements  AfterViewInit{
  title = 'insurance-mf1';
  insuranceDetails: any[] = [];
  selectedInsuranceId: number = 0;
  showSelectInsuranceMessage: boolean = false;
  private abortController: AbortController | undefined

  constructor(private insuranceService: InsuranceDetailsService) {
    this.createReceiveEventListener();
  }

  ngAfterViewInit(): void {
    this.insuranceService.getInsuranceDetails().subscribe((data) => {
      this.insuranceDetails = data;
    });
  }

  sendPayNotification(): void {    
    if(this.selectedInsuranceId > 0){
      this.showSelectInsuranceMessage = false;
      window.parent.postMessage(this.generatePremiumDetailsToBeSend(this.insuranceDetails, this.selectedInsuranceId), environment.urls.parentApplicationUrl);
      this.selectedInsuranceId = 0;
    }
    else{
      this.showSelectInsuranceMessage = true;
    }
    
  }

  receivePaidPremiumfromMFE2ThroughParent(event: MessageEvent){
    if(event.origin === environment.urls.parentApplicationUrl){
      console.log("Received inside mfe1");
      const userPaidEmiInfo = this.generatePremiumDetail(event.data);   
      this.updatePremiumInDB(userPaidEmiInfo);
      if(this.abortController){
        this.abortController.abort();
        this.createReceiveEventListener();  
      }
    }  
  }

  private createReceiveEventListener(){
    if(this.abortController == undefined){
      this.abortController = new AbortController();
    }
    window.addEventListener('message', this.receivePaidPremiumfromMFE2ThroughParent.bind(this), {signal: this.abortController.signal});
  }

  private generatePremiumDetailsToBeSend(allAvailableInsuranceDetails: any[], userSelected: number){
    const premiumDetail: ISendDetails = {
      id : allAvailableInsuranceDetails[userSelected - 1].id,
      name : allAvailableInsuranceDetails[userSelected - 1].name,
      emiValue: allAvailableInsuranceDetails[userSelected - 1].emiValue,
    }
    return premiumDetail;
  }

  private generatePremiumDetail(userPaymentInfo: any){
    const paidPremiumDetail : IPremiumDetails = {
      id : userPaymentInfo.id,
      name : userPaymentInfo.name,
      paidPremium : this.insuranceDetails[userPaymentInfo.id - 1].paidPremium + userPaymentInfo.emiValue,
      amountToPay: this.insuranceDetails[userPaymentInfo.id - 1].amountToPay - userPaymentInfo.emiValue,
      emiValue: this.insuranceDetails[userPaymentInfo.id - 1].emiValue,
      paymentStatus: environment.emiPaymentStatus.paid,
    }
    return paidPremiumDetail;
  }

  private updatePremiumInDB(userPaidEmiInfo: any){
    this.insuranceService.updateInsuranceDetails(userPaidEmiInfo).subscribe((response)=>{
      this.updatePremiumInWeb(userPaidEmiInfo);
    });
  }

  private updatePremiumInWeb(userPaidEmiInfo: any){
    this.insuranceDetails = this.insuranceDetails.map(insurance => {
      if (insurance.id === userPaidEmiInfo.id) {
        return { ...insurance, paidPremium: userPaidEmiInfo.paidPremium,
          amountToPay: userPaidEmiInfo.amountToPay, paymentStatus: userPaidEmiInfo.paymentStatus };
      }
      return insurance;
    });
  }
  
  getPaymentStatusColor(paymentStatus: string): string {
    return paymentStatus === environment.emiPaymentStatus.paid ? 'green' : 'red';
  }
}
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environment/environment';
import { IPaidPremiumDetails } from 'src/model/ipaid-premium-details';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'insurance-mf2';

  premiumInformation: any = undefined;
 
  showPayButton: boolean = false;
  errorMessage: string = '';
  paymentSuccess: boolean = false;

  ngOnInit(): void {
    window.addEventListener('message', this.receivePremiumNotificationfromMFE1ThroughParent.bind(this));

  }

  payEmi(paymentInfo: any){    
      window.parent.postMessage(this.paidEmiDetails(paymentInfo), environment.urls.parentApplicationUrl);
      setTimeout(() => {
        location.reload()
      }, 2000);
  }

  receivePremiumNotificationfromMFE1ThroughParent(event: MessageEvent){
    if(event.origin === environment.urls.parentApplicationUrl){
      this.premiumInformation = event.data;      
    }  
  }

  private paidEmiDetails(paymentInfo: any){
    const paidInsuranceDetails : IPaidPremiumDetails ={
      id: this.premiumInformation.id,
      name: this.premiumInformation.name,
      emiValue: paymentInfo.premiumAmount,
    }
    return paidInsuranceDetails;

  }

  validateEmiValue(enteredAmount: string): void {
    if (enteredAmount < this.premiumInformation.emiValue) {
      this.showPayButton = false;
      this.errorMessage = 'Entered amount should not be less than Rs.' + this.premiumInformation.emiValue;
    } else {
      this.showPayButton = true;
      this.errorMessage = '';
    }
  }
}

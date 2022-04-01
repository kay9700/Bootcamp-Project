import { LightningElement, track, wire, api } from 'lwc';
import getCarsInfo from '@salesforce/apex/CarsController.getCarsInfo';
//import SIMULATOR_INFO from '@salesforce'


export default class PaymentTable extends LightningElement {
    @api parentAmount;
    @api parentDownPayment;
    @api parentTerm;
    
    @api payments 

    @track columns = [
        { label: '# Pay', fieldName: 'pay', type: 'number' },
        { label: 'Unpaid Auto Balance', fieldName: 'unpaidAutoBalance', type: 'currency'  },
        { label: 'Monthly Auto Capital Payment', fieldName: 'monthlyAutoCapitalPayment', type: 'currency'  },
        { label: 'Monthly Payment of Auto Interest', fieldName: 'monthlyPaymentOfAutoInterest', type: 'currency' },
        { label: 'Total Payment with VAT', fieldName: 'totalPaymentWithVAT', type: 'currency' },
    ];


    /*
    @wire(getPaymentsList) 
    WiredPayments( { error, data }) { 
        if(data) { 

        }
    }
    

    
    @track products
    @track error;
    @wire(getCarsInfo) wiredAccounts({data, error}){ 
        if(data) { 
            this.products = data.map(row=>{ 
                return{...row,
                    productModel: row.Product2.Model__c,
                    productBrand: row.Product2.Brand__c,
                    productColor: row.Product2.Color__c,
                    productImage:row.Product2.Image_URL__c,
                    }
                }
            );
            console.log(data);
        }else if (error) { 
            console.log(error);
        }
    }*/
}
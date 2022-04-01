import { LightningElement, track, wire, api } from 'lwc';

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
}
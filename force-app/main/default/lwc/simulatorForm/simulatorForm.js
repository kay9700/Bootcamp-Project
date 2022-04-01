import { LightningElement, track, wire, api } from 'lwc';
import getProductInfo from '@salesforce/apex/CarsController.getProductInfo';
import { loadScript }  from "lightning/platformResourceLoader";

//Import js Libraries to help with the creation of the PDF and format the table
import JSPDF from "@salesforce/resourceUrl/jspdf";
import JSPDF_AUTO_TABLE from "@salesforce/resourceUrl/jspdfautotable";

//import util tu generate the CSV
import {exportCSVFile} from 'c/utils';

export default class SimulatorForm extends LightningElement {

    renderedCallback() {
        Promise.all([loadScript(this, JSPDF), loadScript(this, JSPDF_AUTO_TABLE)])
          .then(() => {
            console.log("loaded");
            this.jsPDFLoaded = true;
          })
          .catch(() => {
            console.log("not loaded");
          });
    }

    @api recordId;
    @api value;
    @api valueTerm;
    
    @track showTable = false;
    @track l_All_Types;
    @track modelOptions;
    @track Picklist_Value;
    @track termPicklistValue

    @track downPayment;
    @track amount;
    records = [];

    paymentHeaders = {
         pay: "# Pay",  
         unpaidAutoBalance: "Unpaid Auto Balance" ,
         monthlyAutoCapitalPayment: "Monthly Auto Capital Payment", 
         monthlyPaymentOfAutoInterest: "Monthly Payment of Auto Interest",
         totalPaymentWithVAT: "Total Payment with VAT",
    }
    
    termOptions = [
        {value: "0", label: "None"},
        {value: "6", label: "6 months"},
        {value: "12", label: "12 months"},
        {value: "18", label: "18 months"},
        {value: "24", label: "24 months"},
        {value: "36", label: "36 months"},
        {value: "48", label: "48 months"},
        {value: "60", label: "60 months"},
    ];

    @wire(getProductInfo, {})
    WiredCars({ error, data }) { 
        if(data) { 
            this.l_All_Types = data;
            let options = [];

            for (var key in data) {
                // Here key will have index of list of records starting from 0,1,2,....
                options.push({ label: data[key].Model__c, value: data[key].Id  });
            }
            this.modelOptions = options;
        }
    }

    handleModelSelection(event){
        this.Picklist_Value = event.target.value; 
    }
    handleTermSelection(event){
        this.termPicklistValue = event.target.value; 
        console.log(this.termPicklistValue);
    }
    handleAmountSelection(event){
        this.amount = event.target.value; 
        console.log(this.amount);
    }
    handleDownPaymentSelection(event){
        this.downPayment = event.target.value; 
    }
    handleCalculate() { 
        this.calculatePayment();
        this.showTable = true;
    }

    handlePDF(event) {
        this.generatePdf();
        console.log("PDF GENERATED");
    }

    handleCSV() { 
        var date = this.getDate();
        var name = "Payment " + date;
        exportCSVFile(this.paymentHeaders, this.records, name)
    }


    calculatePayment() {
        var initialAmount = this.amount;
        var firstPay = this.downPayment;
        var months = parseInt( this.termPicklistValue);
        var interest = 1.05;
        var paymentsInterest = 0;
        var payment = 0;
        var balance = 0;
        var capitalPayment = 0;
        var tax = 1.08;
        var ratePayment= 0;
        var totalPayment = 0;

        if (firstPay > 0 && initialAmount > 0 && months != null){    
            initialAmount = initialAmount - firstPay;
            payment = initialAmount / months;
            balance = initialAmount;
            for(var i = 0; i < months; i++) { 
                paymentsInterest = payment*interest;
                ratePayment = paymentsInterest / 100;
                capitalPayment = paymentsInterest - ratePayment;
                totalPayment = paymentsInterest * tax;
                balance = balance - capitalPayment;
                if(balance<0) { 
                    balance=0;
                }

                var payObj = {
                    pay: "" + (i+1),
                    unpaidAutoBalance: "" + balance.toFixed(2),
                    monthlyAutoCapitalPayment: "" + capitalPayment.toFixed(2),
                    monthlyPaymentOfAutoInterest: "" + ratePayment.toFixed(2),
                    totalPaymentWithVAT: "" + totalPayment.toFixed(2),
                };
                this.records.push(payObj);
                console.log(this.records);
            }

            
        }
    }

    getDate() { 
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        return dateTime;
    }



    generatePdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        var date = this.getDate();
    
        doc.text("Payments Table", 20, 20);
        if (this.records != null) {
          var rows = [];
          var filteredRecords = this.records.map(function (el) {
            var temp = [
              el.pay,
              el.unpaidAutoBalance,
              el.monthlyAutoCapitalPayment,
              el.monthlyPaymentOfAutoInterest,
              el.totalPaymentWithVAT,
            ];
            rows.push(temp);
          });
          console.log(rows);
          //Creation and format the table
          doc.autoTable({
            head: [
              [
                "Pay",
                "Unpaid Auto Balance",
                "Monthly Auto Capital Payment",
                "Monthly Payment Of Auto Interest",
                "Total Payment With VAT",
              ],
            ],
            body: rows,
          });
          
          var name = "Payment - " + date + ".pdf";
          doc.save(name);
        }
    }
}
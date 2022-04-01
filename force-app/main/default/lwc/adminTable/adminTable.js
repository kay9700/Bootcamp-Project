import { LightningElement, track, wire, api } from 'lwc';
import getCarsInfo from '@salesforce/apex/CarsController.getCarsInfo';
import getProductInfo from '@salesforce/apex/CarsController.getProductInfo';
import getProductInAdmin from '@salesforce/apex/CarsController.getProductInAdmin'
import updateProducts from '@salesforce/apex/CarsController.updateProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

import BRAND_FIELD from '@salesforce/schema/Product2.Brand__c';
import MODEL_FIELD from '@salesforce/schema/Product2.Model__c';
import COLOR_FIELD from '@salesforce/schema/Product2.Color__c';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
import ISACTIVE_FIELD from '@salesforce/schema/Product2.IsActive';

import PRODUCT_OBJECT from '@salesforce/schema/Product2';

const columns = [
    {
      label: "Model",
      fieldName: "Model__c",
      type: "text",
      editable: true,
    },
    {
      label: "Brand",
      fieldName: "Brand__c",
      type: "text",
      editable: true ,
    },
    {
      label: "Color",
      fieldName: "Color__c",
      type: "text",
      editable: true ,
    },
    {
      label: "Price",
      fieldName: "Price__c",
      type: "currency",
      editable: true ,
    },
    {
      label: "Image",
      fieldName: "Image_URL__c",
      type: "image",
    },
    {
      label: "Active",
      fieldName: "IsActive",
      type: "boolean",
      editable: true ,
    },
  ];

export default class AdminTable extends LightningElement {
    @api recordId;
    @track columns = columns;

    draftValues = [];

    @track products
    @track error;

    @wire(getProductInAdmin) wiredProducts({data, error}){ 
        if(data) { 
            this.products = data;
            /* .map(row=>{ 
                return{...row,
                    productModel: row.Product2.Model__c,
                    productBrand: row.Product2.Brand__c,
                    productColor: row.Product2.Color__c,
                    productImage:row.Product2.Image_URL__c,
                    productIsActive: row.Product2.IsActive,
                    }
                }
            ); */
            console.log(data);
        }else if (error) { 
            console.log(error);
        }
    };


    async handleSave(event) {
        const updatedFields = event.detail.draftValues;
        console.log("start editing");
        // Prepare the record IDs for getRecordNotifyChange()
        const notifyChangeIds = updatedFields.map(row => { return { "recordId": row.Id } });
    
        try {
            // Pass edited fields to the updateContacts Apex controller
            const result = await updateProducts({data: updatedFields});
            console.log(JSON.stringify("Apex update result: "+ result));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact updated',
                    variant: 'success'
                })
            );
    
            // Refresh LDS cache and wires
            getRecordNotifyChange(notifyChangeIds);
    
            // Display fresh data in the datatable
            refreshApex(this.wiredProducts).then(() => {
                // Clear all draft values in the datatable
                this.draftValues = [];
            });
       } catch(error) {
               this.dispatchEvent(
                   new ShowToastEvent({
                       title: 'Error updating or refreshing records',
                       message: error.body.message,
                       variant: 'error'
                   })
             );
        };
    }
}
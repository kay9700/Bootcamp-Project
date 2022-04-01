import { LightningElement, track, wire, api } from 'lwc';
import getProductInAdmin from '@salesforce/apex/CarsController.getProductInAdmin'
import updateProducts from '@salesforce/apex/CarsController.updateProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
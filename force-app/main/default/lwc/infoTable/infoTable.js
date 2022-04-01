import { LightningElement, wire, track, api} from 'lwc';
import findProduct from '@salesforce/apex/CarsController.findProduct';

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
    },
    {
      label: "Color",
      fieldName: "Color__c",
      type: "text",
    },
    {
      label: "Price",
      fieldName: "Price__c",
      type: "currency",
    },
    {
      label: "Image",
      fieldName: "Image_URL__c",
      type: "image",
    },
  ];

export default class InfoTable extends LightningElement {

    @api varModel; 
    @api varBrand;
    @track columns = columns;

    @track products
    @track error;

    @wire(findProduct, {
        searchModel: "$varModel",
        searchBrand: "$varBrand",
      })
      wiredAccount(value) {
        const { data, error } = value;
    
        if (data) {
          this.products = data;
          this.error = undefined;
        } else if (error) {
          this.error = error;
          this.products = undefined;
        }
      }
    
}
import { LightningElement, wire, track, api } from 'lwc';
import getCarsInfo from '@salesforce/apex/CarsController.getCarsInfo';
import BRAND_FIELD from '@salesforce/schema/Product2.Brand__c';
import MODEL_FIELD from '@salesforce/schema/Product2.Model__c';
import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';

export default class TableFilter extends LightningElement {
    @api recordId;
    @api value;
    
    @track TypeModelOptions;
    @track TypeBrandOptions;
    @track Picklist_Value;
    @track term;
    records;
    timer;
    filteredData = [];
    fullTableData= [];
    @track valueModel = '';
    @track valueBrand = '';

    @wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT})
    objectInfo;

    @wire(getPicklistValues, 
        {   
            recordTypeId: '$objectInfo.data.defaultRecordTypeId',
            fieldApiName: BRAND_FIELD,
        }
    )brandValuesPicklist;

    @wire(getPicklistValues, 
        {   
            recordTypeId: '$objectInfo.data.defaultRecordTypeId',
            fieldApiName: MODEL_FIELD,
        }
    )modelValuesPicklist;


    handleModelSelection(event){
        this.Picklist_Value = event.target.value; 
        this.valueModel = event.target.value;
    }

    handleBrandSelection(event){
        this.Picklist_Value = event.target.value; 
        this.valueBrand = event.target.value;
    }

    handleFilter(event) {
        this.valueModel = '';
        this.valueBrand = '';
    }
}
import { LightningElement, track, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
//import getCarsInfo from '@salesforce/apex/CarsController.getCarsInfo';

export default class AppointmentForm extends LightningElement {
    handleSubmit() { 
        const event = new ShowToastEvent({
            title: 'Appointment Success',
            message:
                'Your appointment has been sumbited. Shortly you will receive a confirmation email.',
            variant: 'success'
        });
        this.dispatchEvent(event);
    }
}
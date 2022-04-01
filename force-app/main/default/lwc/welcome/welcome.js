import { LightningElement } from 'lwc';

export default class Welcome extends LightningElement {
    message = "Bienvenido";

    //method
    changeHandler(event){
        this.title = event.target.value
    }

    address = {
        city: 'citinati',
        price: 3445
    }
}
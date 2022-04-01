import { LightningElement, api } from 'lwc';

export default class ImageControlCreation extends LightningElement {
    @api url;
    @api altText;
}
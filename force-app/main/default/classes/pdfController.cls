public with sharing class pdfController {
    @AuraEnabled
    public static Attachment generatePDF( String htmlData){
        Pagereference page = Page.renderAsPDF;
        page.getParameters().put('pdfText', htmlData);

        Attachment objAttachment = new Attachment();
        objAttachment.Name = 'payment.pdf';
        objAttachment.Body = page.getContentAspdf();
        objAttachment.IsPrivate = false;
        insert objAttachment;
        return objAttachment;
    }
}

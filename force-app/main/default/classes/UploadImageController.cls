public with sharing class UploadImageController {
    @AuraEnabled
    public static String saveFile(String strFileName, String base64Data, string carBrand, string carModel, string carColor, integer carPrice) {

        // Decoding base64Data
        base64Data = EncodingUtil.urlDecode(base64Data, 'UTF-8');

        //Creation and insertion of object
        String carName = carBrand + ' ' + carModel;
        Product2 carObj = new Product2();
        carObj.Name = carName;
        carObj.Brand__c=carBrand;
        carObj.Model__c=carModel;
        carObj.Color__c=carColor;
        carObj.Price__c=carPrice;
        carObj.IsActive=true;
        insert carObj;
        
        //Getting product just created id
        Product2 product = [SELECT Id, Name FROM Product2 WHERE Name =:carName AND Brand__c =:carBrand AND Color__c =:carColor LIMIT 1];
        String productId = product.Id;

        // inserting file
        ContentVersion cv = new ContentVersion();
        cv.Title = strFileName;
        cv.PathOnClient = '/' + strFileName;
        cv.FirstPublishLocationId = productId;
        cv.VersionData = EncodingUtil.base64Decode(base64Data);
        cv.IsMajorVersion = true;
        Insert cv;

        //Getting the id of the linked product with content document 
        list<id> lstConDocs = new list<id>();
        for(ContentDocumentLink cntLink : [Select Id, ContentDocumentId From ContentDocumentLink Where LinkedEntityId =:productId]) {
            lstConDocs.add(cntLink.ContentDocumentId);
        }

        //Get the distribution link and associate with the product through the id.
        ContentDistribution cdl = new ContentDistribution();
        cdl.ContentVersionId = [SELECT Id, Title, ContentDocumentId FROM ContentVersion WHERE ContentDocumentId IN :lstConDocs LIMIT 1].Id;
        cdl.Name = 'PublicShare';
        insert cdl;
        Product2 p = new Product2();
        p.id = productId;
        system.debug(productId);
        p.Image_URL__c = [SELECT DistributionPublicUrl, ContentDownloadUrl FROM ContentDistribution WHERE Id = :cdl.Id LIMIT 1].ContentDownloadUrl;
        update p;
        return [SELECT DistributionPublicUrl, ContentDownloadUrl FROM ContentDistribution WHERE Id = :cdl.Id LIMIT 1].ContentDownloadUrl;

    }
}

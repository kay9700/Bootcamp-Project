public with sharing class CarsController {
    
    @AuraEnabled(cacheable=True)
    public static List<PricebookEntry> getCarsInfo() {
        List<PricebookEntry> carsInfo = [SELECT Id, Product2Id, Product2.Name, Product2.IsActive, 
                                            Product2.Brand__c, Product2.Model__c, Product2.Price__c, Product2.Color__c,
                                            Product2.Image_URL__c, UnitPrice                                           
                                            FROM PricebookEntry WHERE Product2.IsActive = True
                                            AND Product2.Model__c != null
                                            LIMIT 10000]; 
        return carsInfo;
    }

    @AuraEnabled(cacheable=True)
    public static List<Product2> getProductInfo() {
        List<Product2> carsInfo = [SELECT Id, Name, IsActive, Brand__c, Model__c, Price__c, Color__c, Image_URL__c                                           
                                    FROM Product2 WHERE IsActive = True
                                    AND Model__c != null
                                    LIMIT 10000]; 
        return carsInfo;
    }

    @AuraEnabled(cacheable=True)
    public static List<Product2> getProductInAdmin() {
        List<Product2> carsInfo = [SELECT Id, Name, IsActive, Brand__c, Model__c, Price__c, Color__c, Image_URL__c                                           
                                    FROM Product2 WHERE Model__c != null
                                    LIMIT 10000]; 
        return carsInfo;
    }

    @AuraEnabled
    public static string updateProducts( Object data ) {
        
        List < Product2 > productsUpdate = ( List < Product2 > ) JSON.deserialize(
            JSON.serialize( data ),
            List < Product2 >.class
        );
        try {
            update productsUpdate;
            return 'Success: Product(s) updated successfully';
        }
        catch (Exception e) {
            return 'The following exception has occurred: ' + e.getMessage();
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<PricebookEntry> findProduct(String searchModel, String searchBrand){

        String[] criteria = new List<String>();
        String whereClause = '';
        String keyModel = searchModel ;
        String keyBrand = searchBrand;

        if(!String.isEmpty(searchModel)){
            keyModel = '%' + searchModel + '%';
            criteria.add('Model__c LIKE :keyModel');
        }

        if(!String.isEmpty(searchBrand)){
            keyBrand = '%' + searchBrand + '%';
            criteria.add('Brand__c LIKE :keyBrand');
        }

        if(criteria.size()>0){
            whereClause = ' AND ' + String.join(criteria, ' AND ');
        }

        String query = 'SELECT Id, Name, IsActive, Brand__c, Model__c, Color__c, Price__c, 	Image_URL__c FROM Product2 WHERE IsActive = true AND Model__c != null ' + whereClause;
        
        return Database.query(query);      
    }
    

}

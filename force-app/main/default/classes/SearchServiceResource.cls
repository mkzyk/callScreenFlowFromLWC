public with sharing class SearchServiceResource {
    @AuraEnabled(cacheable=true)
    public static list<ServiceResource> searchSR(String searchWord) {
        String searchKeyword = '%' + searchWord + '%';
		
        // create ServiceResource list to store search result 
        List<ServiceResource> srRecords = new List<ServiceResource>();
     
	    // query ServiceResource records
        List<ServiceResource> srs = [SELECT Id, Name, ResourceType, RoleText__c
                                     FROM ServiceResource 
                                     WHERE Name LIKE :searchKeyword AND IsActive = True WITH SECURITY_ENFORCED];

        for(ServiceResource sr : srs)
        {
            srRecords.add(sr);
        }
        
        if(srRecords.size() == 0){
            throw new AuraHandledException('検索結果が見つかりませんでした'); 
        }
         
        return srRecords;
    }

    @AuraEnabled
    public static String getInvitationURL(){
        BookingInvitation__mdt biMdt = BookingInvitation__mdt.getInstance('BookingInvitationData');
        return biMdt.InvitationURL__c;
    }
}

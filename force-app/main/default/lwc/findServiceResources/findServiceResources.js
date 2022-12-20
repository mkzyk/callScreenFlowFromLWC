import { LightningElement, track, api } from 'lwc';
// import server side apex class method 
import getServiceResourceList from '@salesforce/apex/SearchServiceResource.searchSR';
import getInvitaionURL from '@salesforce/apex/SearchServiceResource.getInvitationURL';
// import standard toast event 
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

const columns = [
                    { label: '名前', fieldName: 'Name', sortable: true },
                    { label: 'リソース種別', fieldName: 'ResourceType', sortable: true },
                    { label: 'ロール', fieldName: 'RoleText__c', sortable: true },
                ];

const apiName = 'generateInvitationURL';

export default class findServiceResources extends LightningElement {
    
    @track srRecord;
    columns = columns;
    searchValue = '';
    selectedResourceId = '';
    canClick = false;
    flowApiName = apiName;

    InvitationURLPrefix = '';
    flowInputVariables = [];
    renderFlow = false;

    connectedCallback() {
        getInvitaionURL()
        .then(result => {
            this.InvitationURLPrefix = result;
        })
        .catch(error => {
            this.error = error;
        })
    }
 
    // update searchValue var when input field value change
    searchKeyword(event) {
        this.searchValue = event.target.value;
    }
 
    // call apex method on button click 
    handleSearchKeyword() {
        
        if (this.searchValue !== '') {
            getServiceResourceList({
                    searchWord: this.searchValue
                })
                .then(result => {
                    // set @track contacts variable with return contact list from server  
                    this.srRecord = result;
                })
                .catch(error => {
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);
                    // reset contacts var with null   
                    this.srRecord = null;
                });
        } else {
            // fire toast event if input field is blank
            const event = new ShowToastEvent({
                variant: 'error',
                message: '検索対象の文字がありません',
            });
            this.dispatchEvent(event);
        }
    }

    getSelected(event) {
        const selectedRows = event.detail.selectedRows;
        // Display that fieldName of the selected rows
        for (let i = 0; i < selectedRows.length; i++) {
            //alert('You selected: ' + selectedRows[i].Id);
            this.selectedResourceId = selectedRows[i].Id;
        }
        console.log('selectedResourceId : ' + this.selectedResourceId);

        if(this.selectedResourceId) {
            this.canClick = true;
        }
    }

    isRowSelected() {
        console.log(this.canClick);
        if(!this.canClick) {
            const event = new ShowToastEvent({
                variant: 'error',
                message: 'リソースを選択してください！',
            });
            this.dispatchEvent(event);
        } else {
            this.flowInputVariables = [
                {
                    name: 'recordId',
                    type: 'String',
                    value: this.selectedResourceId
                },
                {
                    name: 'InvitationURLPrefix',
                    type: 'String',
                    value: this.InvitationURLPrefix
                },
            ];
            this.renderFlow = true;
        }
    }

    handleFlowStatusChange(event) {
		console.log("flow status : ", event.detail.status);
		console.log("recordId : ", this.selectedResourceId);
		console.log("InvitationURLPrefix : ", this.InvitationURLPrefix);
		if (event.detail.status === "FINISHED") {
			this.dispatchEvent(
				new ShowToastEvent({
					title: "成功: ",
					message: "面談URLを生成しました！",
					variant: "success",
				})
			);
		}
	}
}
import { LightningElement, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent'

const apiName = 'generateInvitationURL';
export default class CallFlow extends LightningElement {
    flowApiName = apiName;
    @api recordId;
    InvitationURLPrefix = 'https://hrindustry111422.my.site.com/jobOffering/s/BookingInvitationPage';
    flowInputVariables = [
        {
            name: 'recordId',
            type: 'String',
            value: this.recordId
        },
        {
            name: 'InvitationURLPrefix',
            type: 'String',
            value: this.InvitationURLPrefix
        },
    ];
    handleFlowStatusChange(event) {
		console.log("flow status", event.detail.status);
		console.log("recordId", this.recordId);
		if (event.detail.status === "FINISHED") {
			this.dispatchEvent(
				new ShowToastEvent({
					title: "Success",
					message: "Flow Finished Successfully",
					variant: "success",
				})
			);
		}
	}
}
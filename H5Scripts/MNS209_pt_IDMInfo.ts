/*
*/

class MNS209_pt_IDMInfo {
	// standard variables to be populated from framework
	private gController: IInstanceController;
	private gDebug: IScriptLog;
	private gContent: IContentElement;
	private args;

	//-- custom --
	private gDetailButton;
	private gDetailButtonTop = 6;
	private gDetailButtonLeft = 40;
	private gDetailButtonTitle = "IDM Status";
	private gDetailButtonID = "MNS209_pt_IDMInfo_IDM_Status";

	private gDataButton;
	private gDataButtonTop = 7;
	private gDataButtonLeft = 40;
	private gDataButtonTitle = "IDM Data";
	private gDataButtonID = "MNS209_pt_IDMInfo_IDM_Data";

	private gIONAPIUrl;

	constructor(args: IScriptArgs) {
		this.gController = args.controller;
		this.gDebug = args.log;
		this.gContent = args.controller.GetContentElement();
	}

	private static Init(args: IScriptArgs) {
		new MNS209_pt_IDMInfo(args).run();
	}

	private run(): void {
		this.gIONAPIUrl = ScriptUtil.GetUserContext().IonApiUrl;
		if (this.gIONAPIUrl) {
			this.addControls();
		}
		else {
			// we should show an error dialog here!
		}
		else {
			// no record selected
		}
	}

	private detailButtonClicked(): void {
		let guid = ListControl.ListView.GetValueByColumnName("GUID");
		if (guid) {
		}
	}

	private dataButtonClicked(): void {
		let guid = ListControl.ListView.GetValueByColumnName("GUID");
		if (guid) {
			let state = 0;
			let apiURL = `${this.gIONAPIUrl}/IDM/api/items/search?%24query=%2fMDS_DistributionJobs%5B%40MDS_ID%20%3D%22${guid}%22%5D&%24offset=0&%24limit=15`;
			let stateURL = `&%24state=${state}`;
		}
		else {
			// no record selected
		}
	}

	private displayDialog(aDialogContent, aDialogOptions) {
		if (ScriptUtil.version >= 2.0) {
			H5ControlUtil.H5Dialog.CreateDialogElement(aDialogContent[0], aDialogOptions);
		}
		else {
			aDialogContent.inforMessageDialog(aDialogOptions);
		}
	}

	private addControls() {
		this.gDetailButton = this.gContent.AddElement(this.addButtonControl(this.gDetailButtonTitle, this.gDetailButtonID, this.gDetailButtonLeft, this.gDetailButtonTop, undefined));
		this.gDataButton = this.gContent.AddElement(this.addButtonControl(this.gDataButtonTitle, this.gDataButtonID, this.gDataButtonLeft, this.gDataButtonTop, undefined));

		this.gDetailButton.click({}, () => { this.detailButtonClicked });
		this.gDataButton.click({}, () => { this.dataButtonClicked });
	}

	// boilerplate create button control
	private addButtonControl(aContent: string, aID: string, aLeftColumn: number, aTopRow: number, aWidth: number) {
		let result = new ButtonElement();

		if (aWidth) {
			result.Position = {
				Top: aTopRow, Left: aLeftColumn, Width: aWidth
			}
		}
		else {
			result.Position = {
				Top: aTopRow, Left: aLeftColumn
			}
		}

		result.Value = aContent;
		result.Name = aID;

		return (result);
	}
}
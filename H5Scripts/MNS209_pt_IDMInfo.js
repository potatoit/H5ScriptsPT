/*
*/
class MNS209_pt_IDMInfo {
    constructor(args) {
        this.gDetailButtonTop = 6;
        this.gDetailButtonLeft = 40;
        this.gDetailButtonTitle = "IDM Status";
        this.gDetailButtonID = "MNS209_pt_IDMInfo_IDM_Status";
        this.gDataButtonTop = 7;
        this.gDataButtonLeft = 40;
        this.gDataButtonTitle = "IDM Data";
        this.gDataButtonID = "MNS209_pt_IDMInfo_IDM_Data";
        this.gController = args.controller;
        this.gDebug = args.log;
        this.gContent = args.controller.GetContentElement();
    }
    static Init(args) {
        new MNS209_pt_IDMInfo(args).run();
    }
    run() {
        this.gIONAPIUrl = ScriptUtil.GetUserContext().IonApiUrl;
        if (this.gIONAPIUrl) {
            this.addControls();
        }
        else {
            // we should show an error dialog here!
        }
    }
    detailButtonClicked() {
        let guid = ListControl.ListView.GetValueByColumnName("GUID");
        if (guid) {
        }
    }
    dataButtonClicked() {
        let guid = ListControl.ListView.GetValueByColumnName("GUID");
        if (guid) {
            let state = 0;
            let apiURL = `${this.gIONAPIUrl}/IDM/api/items/search?%24query=%2fMDS_DistributionJobs%5B%40MDS_ID%20%3D%22${guid}%22%5D&%24offset=0&%24limit=15`;
            let stateURL = `&%24state=${state}`;
        }
    }
    displayDialog(aDialogContent, aDialogOptions) {
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(aDialogContent[0], aDialogOptions);
        }
        else {
            aDialogContent.inforMessageDialog(aDialogOptions);
        }
    }
    addControls() {
        this.gDetailButton = this.gContent.AddElement(this.addButtonControl(this.gDetailButtonTitle, this.gDetailButtonID, this.gDetailButtonLeft, this.gDetailButtonTop, undefined));
        this.gDataButton = this.gContent.AddElement(this.addButtonControl(this.gDataButtonTitle, this.gDataButtonID, this.gDataButtonLeft, this.gDataButtonTop, undefined));
        this.gDetailButton.click({}, () => { this.detailButtonClicked; });
        this.gDataButton.click({}, () => { this.dataButtonClicked; });
    }
    // boilerplate create button control
    addButtonControl(aContent, aID, aLeftColumn, aTopRow, aWidth) {
        let result = new ButtonElement();
        if (aWidth) {
            result.Position = {
                Top: aTopRow, Left: aLeftColumn, Width: aWidth
            };
        }
        else {
            result.Position = {
                Top: aTopRow, Left: aLeftColumn
            };
        }
        result.Value = aContent;
        result.Name = aID;
        return (result);
    }
}
//# sourceMappingURL=MNS209_pt_IDMInfo.js.map
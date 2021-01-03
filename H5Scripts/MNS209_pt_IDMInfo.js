/*
*/
var MNS209_pt_IDMInfo = /** @class */ (function () {
    function MNS209_pt_IDMInfo(args) {
        this.gDetailButtonTop = 6;
        this.gDetailButtonLeft = 40;
        this.gDetailButtonTitle = "IDM Status";
        this.gDetailButtonID = "MNS209_pt_IDMInfo_IDM_Status";
        this.gController = args.controller;
        this.gDebug = args.log;
        this.gContent = args.controller.GetContentElement();
    }
    MNS209_pt_IDMInfo.Init = function (args) {
        new MNS209_pt_IDMInfo(args).run();
    };
    MNS209_pt_IDMInfo.prototype.run = function () {
        this.gIONAPIUrl = ScriptUtil.GetUserContext().IonApiUrl;
        if (this.gIONAPIUrl) {
            this.addControls();
        }
        else {
            // we should show an error dialog here!
        }
    };
    MNS209_pt_IDMInfo.prototype.getJSONFromIDM = function (aGUID, aState) {
        var _this = this;
        var dialogOptions;
        if (aGUID) {
            var state = aState;
            // /MDS_DistributionJobs[@batchId="004781870646366805"]
            // BJNO: 004781870646366805
            // PID: MDS_DistributionJobs-17350-8-LATEST
            // MDS_DistributionJobs-17350-8-LATEST
            var request = {
                url: "/IDM/api/items/search/",
                method: "GET",
                record: {
                    $query: "/MDS_DistributionJobs[@MDS_ID =\"" + aGUID + "\"]",
                    $offset: 0,
                    $limit: 15,
                    $state: state,
                    $includeCount: true
                }
            };
            IonApiService.Current.execute(request).then(function (response) {
                var message = "<style>.text {  -moz-user-select: text;  -webkit-user-select: text;  -ms-user-select: text;  user-select: text;}</style>";
                if (response.data && response.data.items && response.data.items.item && response.data.items.item.length > 0) {
                    var _loop_1 = function (i) {
                        var currentItem = response.data.items.item[i];
                        var createdBy = currentItem.createdByName;
                        var pid = currentItem.pid;
                        var status_1 = "";
                        var errorMessage = "";
                        var timeToComplete = "";
                        var timeFromSubmitting = "";
                        var retryCount = "";
                        var phase = "";
                        message += "<div class=\"row text\"><h2 class=\"fieldset-title\">GUID: " + aGUID + " - " + createdBy + "</h2>";
                        var targetMessage = "";
                        if (currentItem.attrs && currentItem.attrs.attr && currentItem.attrs.attr.length > 0) {
                            for (var j = 0; j < currentItem.attrs.attr.length; j++) {
                                var currentAttribute = currentItem.attrs.attr[j];
                                if (currentAttribute.name === "status" && currentAttribute.value) {
                                    status_1 = currentAttribute.value;
                                }
                                else if (currentAttribute.name === "errorMessage" && currentAttribute.value) {
                                    errorMessage = currentAttribute.value;
                                }
                                else if (currentAttribute.name === "timeToComplete" && currentAttribute.value) {
                                    timeToComplete = currentAttribute.value;
                                }
                                else if (currentAttribute.name === "timeFromSubmitting" && currentAttribute.value) {
                                    timeFromSubmitting = currentAttribute.value;
                                }
                                else if (currentAttribute.name === "retryCount" && currentAttribute.value) {
                                    retryCount = currentAttribute.value;
                                }
                                else if (currentAttribute.name === "phase" && currentAttribute.value) {
                                    phase = currentAttribute.value;
                                }
                                else if (currentAttribute.name === "publicTargetStatus" && currentAttribute.value) {
                                    if (currentAttribute.value) {
                                        var publicStatus = JSON.parse(currentAttribute.value);
                                        if (publicStatus && publicStatus.length > 0) {
                                            for (var k = 0; k < publicStatus.length; k++) {
                                                var targetType = publicStatus[k].type;
                                                if (targetMessage.length > 0) {
                                                    targetMessage += "<br/>";
                                                }
                                                targetMessage += " <b>Type:</b> " + targetType;
                                                if (publicStatus[k].description) {
                                                    var rawDescription = publicStatus[k].description;
                                                    var startDescription = rawDescription.indexOf("{");
                                                    var endDescription = rawDescription.lastIndexOf("}");
                                                    if (-1 != startDescription && -1 != endDescription && !(endDescription <= startDescription)) {
                                                        var jsonStatus = JSON.parse(rawDescription.substring(startDescription, endDescription + 1));
                                                        if (jsonStatus && jsonStatus.length > 0) {
                                                            for (var l = 0; l < jsonStatus.length; l++) {
                                                                if (jsonStatus[l].type === "print") {
                                                                    var printerMessage = jsonStatus[l].message;
                                                                    targetMessage += " <b>Message:</b> " + printerMessage;
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                                targetMessage += "<br/>";
                                            }
                                        }
                                    }
                                }
                            }
                            message += "<div class=\"row\"><div class=\"six columns\"><b>PID:</b> " + pid + " </div><div class=\"six columns\"></div></div>";
                            message += "<div class=\"row\"><div class=\"four columns\"><b>Status:</b> " + status_1 + "</div><div class=\"four columns\"><b>Phase:</b> " + phase + "</div><div class=\"four columns\"><b>Retries:</b> " + retryCount + "</div></div>";
                            message += "<div class=\"row\"><div class=\"six columns\"><b>Time from submitting:</b> " + timeFromSubmitting + "</div><div class=\"six columns\"><b>Time to complete:</b> " + timeToComplete + "</div></div>";
                            message += "<div class=\"row\"><b>Error Message:</b> " + errorMessage + "</div>";
                            message += "<div class=\"row\">" + targetMessage + "</div>";
                        }
                        message += "<div id=\"" + aGUID + "\">Loading...</div>";
                        message += '</div>';
                        var _mylocal = _this;
                        dialogOptions = {
                            title: "Info",
                            dialogType: "General",
                            modal: true,
                            width: 600,
                            minHeight: 480,
                            icon: "info",
                            closeOnEscape: true,
                            close: function () {
                                $(this).remove();
                            },
                            open: function () {
                                //debugger;
                                var content = $("#" + aGUID);
                                _mylocal.getFile(pid, content);
                            },
                            buttons: [{
                                    text: "OK",
                                    isDefault: true,
                                    width: 80,
                                    click: function (event, model) {
                                        if (ScriptUtil.version >= 2.0) {
                                            model.close(true);
                                        }
                                        else {
                                            $(this).inforDialog("close");
                                        }
                                    }
                                }
                            ]
                        };
                    };
                    for (var i = 0; i < response.data.items.item.length; i++) {
                        _loop_1(i);
                    }
                    _this.displayDialog(message, dialogOptions);
                    if (_this.gController.ShowMessageInStatusBar) {
                        _this.gController.ShowMessageInStatusBar("Finished");
                    }
                }
                else {
                    if (aState < 2) {
                        _this.getJSONFromIDM(aGUID, aState + 1);
                    }
                    else {
                        _this.gController.ShowMessage("No data found in IDM");
                    }
                }
            }).catch(function (response) {
                _this.gController.ShowMessage("Exception: " + response.status + " " + response.statusText);
            });
        }
        else {
            // no record selected
        }
        if (this.gController.ShowMessageInStatusBar) {
            this.gController.ShowMessageInStatusBar("Finished");
        }
    };
    MNS209_pt_IDMInfo.prototype.detailButtonClicked = function () {
        var guid = ListControl.ListView.GetValueByColumnName("GUID");
        if (this.gController.ShowMessageInStatusBar) {
            this.gController.ShowMessageInStatusBar("Retrieving Data");
        }
        this.getJSONFromIDM(guid, 0);
    };
    MNS209_pt_IDMInfo.prototype.getFile = function (aPID, aContent) {
        var _this = this;
        var request = {
            url: "/IDM/api/items/" + aPID + "/resource/stream/",
            headers: { Accept: "application/octet-stream;charset=utf-8" },
            method: "GET",
            record: {
                $webdav: "false"
            }
        };
        IonApiService.Current.execute(request).then(function (response) {
            var priorityData = [];
            var decodedBody = "";
            var message = "";
            if (response.data) {
                try {
                    var indata = response.data; //JSON.parse(response.data);
                    if (indata) {
                        if (indata.input && indata.input.length > 0 && indata.input[0] && indata.input[0].data && indata.input[0].data.base64) {
                            decodedBody = atob(indata.input[0].data.base64);
                        }
                        message += "<h2>Priorites</h2>";
                        //debugger;
                        if (indata.input && indata.input[0].template && indata.input[0].template.priority && indata.input[0].template.priority.length > 0) {
                            for (var i = 0; i < indata.input[0].template.priority.length; i++) {
                                var currentTemplate = indata.input[0].template.priority[i];
                                if (currentTemplate.type === "xquery") {
                                    priorityData.push(currentTemplate.xquery);
                                    message += "<div class=\"row\"><div class=\"twelve columns\">" + currentTemplate.xquery + "</div></div>";
                                }
                            }
                        }
                        if (indata.targets && indata.targets.length > 0) {
                            var targetType = "";
                            message += "<h2>Targets</h2>";
                            for (var i = 0; i < indata.targets.length; i++) {
                                var currentTarget = indata.targets[i];
                                var currentTargetType = currentTarget.type;
                                message += "<div class=\"row\"><div class=\"twelve columns\"><b>Target Type:</b> " + currentTargetType + "</div></div>";
                                if (currentTargetType === "email") {
                                    var currentTargetTo = currentTarget.to;
                                    var currentTargetcc = currentTarget.cc;
                                    var currentTargetSubject = currentTarget.subject;
                                    var currentTargetBody = currentTarget.body;
                                    var currentTargetFrom = currentTarget.from;
                                    if (currentTargetTo && currentTargetTo.length > 0) {
                                        message += "<div class=\"row\"><div class=\"twelve columns\"><b>To:</b>" + currentTargetTo + "</div></div>";
                                    }
                                    if (currentTargetcc && currentTargetcc.length > 0) {
                                        message += "<div class=\"row\"><div class=\"twelve columns\"><b>CC:</b>" + currentTargetcc + "</div></div>";
                                    }
                                    if (currentTargetSubject && currentTargetSubject.length > 0) {
                                        message += "<div class=\"row\"><div class=\"twelve columns\"><b>Subject:</b>" + currentTargetSubject + "</div></div>";
                                    }
                                    if (currentTargetBody && currentTargetBody.length > 0) {
                                        message += "<div class=\"row\"><div class=\"twelve columns\"><b>Body:</b>" + currentTargetBody + "</div></div>";
                                    }
                                    if (currentTargetFrom && currentTargetFrom.length > 0) {
                                        message += "<div class=\"row\"><div class=\"twelve columns\"><b>From:</b>" + currentTargetFrom + "</div></div>";
                                    }
                                }
                                else if (currentTargetType === "print") {
                                    var currentTargetPrinterID = currentTarget.printerId;
                                    var currentTargetCopies = currentTarget.noOfCopies;
                                    if (currentTargetPrinterID && currentTargetPrinterID.length > 0) {
                                        message += "<div class=\"row\"><div class=\"twelve columns\"><b>Printer ID:</b> " + currentTargetPrinterID + "</div></div>";
                                    }
                                    if (currentTargetCopies && currentTargetCopies.length > 0) {
                                        message += "<div class=\"row\"><div class=\"twelve columns\"><b>Copies:</b>" + currentTargetCopies + "</div></div>";
                                    }
                                }
                            }
                        }
                        message += "<br/><textarea class=\"textarea\" readonly=\"true\" width=\"500px\">" + decodedBody + "</textarea>";
                        if (aContent) {
                            //aContent.text = "";
                            //aContent.append(message);
                            aContent.html(message);
                        }
                        //this.displayDialog(message, undefined);
                    }
                }
                catch (ex) {
                    // failed to parse JSON result
                }
            }
            else {
                message = "<h2>Data not found</h2>";
            }
        }).catch(function (response) {
            _this.gController.ShowMessage("Exception: " + response.status + " " + response.statusText);
        });
    };
    MNS209_pt_IDMInfo.prototype.displayDialog = function (aDialogContent, aDialogOptions) {
        if (!aDialogOptions) {
            aDialogOptions = {
                title: "Info",
                dialogType: "General",
                modal: true,
                width: 600,
                minHeight: 480,
                icon: "info",
                closeOnEscape: true,
                close: function () {
                    $(this).remove();
                },
                buttons: {
                    Ok: function () {
                        $(this).inforDialog("destroy").remove();
                    }
                }
            };
        }
        if (ScriptUtil.version >= 2.0) {
            H5ControlUtil.H5Dialog.CreateDialogElement(aDialogContent[0], aDialogOptions);
        }
        else {
            $('<div>' + aDialogContent + '</div>').inforMessageDialog(aDialogOptions);
        }
    };
    MNS209_pt_IDMInfo.prototype.addControls = function () {
        var _this = this;
        this.gDetailButton = this.gContent.AddElement(this.addButtonControl(this.gDetailButtonTitle, this.gDetailButtonID, this.gDetailButtonLeft, this.gDetailButtonTop, undefined));
        this.gDetailButton.click({}, function () { _this.detailButtonClicked(); });
    };
    // boilerplate create button control
    MNS209_pt_IDMInfo.prototype.addButtonControl = function (aContent, aID, aLeftColumn, aTopRow, aWidth) {
        var result = new ButtonElement();
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
    };
    return MNS209_pt_IDMInfo;
}());
//# sourceMappingURL=MNS209_pt_IDMInfo.js.map
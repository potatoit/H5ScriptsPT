﻿/**
 * Name: MNS209_pt_IDMInfo
 * Panel: MNS209/B
 * Arguments: none
 * 
 * This is a script to retrieve the IDM information for the selected output in MNS209
 * This will leverage the IONAPIs to query IDM Distribution Jobs
 * 
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

	private gionapiService : any;
	private loadingState = "Loading...";

	constructor(args: IScriptArgs) {
		this.gController = args.controller;
		this.gDebug = args.log;
		this.gContent = args.controller.GetContentElement();


		if (ScriptUtil.version >= 2.0) {
			this.gionapiService = IonApiService;
		}
		else {
			this.gionapiService = IonApiService.Current;
		}
	}

	private static Init(args: IScriptArgs) {
		new MNS209_pt_IDMInfo(args).run();
	}

	private run(): void {
			this.addControls();
	}

	private getJSONFromIDM(aGUID, aState) {
		let dialogOptions;

		if (aGUID) {
			let state = aState;

			let request: IonApiRequest = {
				url: `/IDM/api/items/search/`,
				method: "GET",
				record: {
					$query: `/MDS_DistributionJobs[@MDS_ID ="${aGUID}"]`,
					$offset: 0,
					$limit: 15,
					$state: state,
					$includeCount: true
				}
			}
			this.gionapiService.execute(request).then((response: IonApiResponse) => {
				// allow the text to be selectable so we can copy and paste it
				let message = `<div style="height: 370px;overflow: auto"><style>.text {  -moz-user-select: text;  -webkit-user-select: text;  -ms-user-select: text;  user-select: text;font-size: 13px;}</style>`;

				if (response.data && response.data.items && response.data.items.item && response.data.items.item.length > 0) {
					let jsonString = JSON.stringify(response.data);
					for (let i = 0; i < response.data.items.item.length; i++) {
						let currentItem = response.data.items.item[i];

						let createdBy = currentItem.createdByName;
						let pid = currentItem.pid;
						let status = "";
						let errorMessage = "";
						let timeToComplete = "";
						let timeFromSubmitting = "";
						let retryCount = "";
						let phase = "";

						message += `<div class="row text"><h2 class="fieldset-title">GUID: ${aGUID} - ${createdBy}</h2>`;

						let targetMessage = "";

						if (currentItem.attrs && currentItem.attrs.attr && currentItem.attrs.attr.length > 0) {
							for (let j = 0; j < currentItem.attrs.attr.length; j++) {
								let currentAttribute = currentItem.attrs.attr[j];
								if (currentAttribute.name === "status" && currentAttribute.value) {
									status = currentAttribute.value;
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

										let publicStatus = JSON.parse(currentAttribute.value);
										if (publicStatus && publicStatus.length > 0) {
											for (let k = 0; k < publicStatus.length; k++) {
												let targetType = publicStatus[k].type;

												if (targetMessage.length > 0) {
													targetMessage += "<br/>";
												}

												targetMessage += ` <b>Type:</b> ${targetType}`;

												if (publicStatus[k].description) {
													let rawDescription = publicStatus[k].description;
													let startDescription = rawDescription.indexOf("{");
													let endDescription = rawDescription.lastIndexOf("}");
													if (-1 != startDescription && -1 != endDescription && !(endDescription <= startDescription)) {
														let jsonStatus = JSON.parse(rawDescription.substring(startDescription, endDescription + 1));
														if (jsonStatus && jsonStatus.length > 0) {
															for (let l = 0; l < jsonStatus.length; l++) {
																if (jsonStatus[l].type === "print") {
																	let printerMessage = jsonStatus[l].message;
																	targetMessage += ` <b>Message:</b> ${printerMessage}`;
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
							message += `<div class="row"><div class="six columns"><b>PID:</b> ${pid} </div><div class="six columns"></div></div>`;
							message += `<div class="row"><div class="four columns"><b>Status:</b> ${status}</div><div class="four columns"><b>Phase:</b> ${phase}</div><div class="four columns"><b>Retries:</b> ${retryCount}</div></div>`;

							message += `<div class="row"><div class="six columns"><b>Time from submitting:</b> ${timeFromSubmitting}</div><div class="six columns"><b>Time to complete:</b> ${timeToComplete}</div></div>`;

							message += `<div class="row"><b>Error Message:</b> ${errorMessage}</div>`;
							message += `<div class="field">${targetMessage}</div>`;
						}

						message += `<br/><h3>IDM JSON</h3><div class="field" style="width: 90%"><textarea class="textarea" readonly="true" style="width: 90%; font-size: 12px; height: 40px" >${jsonString}</textarea></div><br/>`;

						// this is the anchor for the details we will retrieve
						message += `<div id="${aGUID}">${this.loadingState}</div>`;
						message += '</div></div>';

						let _mylocal = this;

						dialogOptions = {
							title: "Info",
							dialogType: "General",
							modal: true,
							minWidth: 500,
							minHeight: 480,
							icon: "info",
							closeOnEscape: true,
							close: function () {
								$(this).remove();
							}
							,
							buttons: [{
								text: "OK",
								isDefault: true,
								width: 80,
								click: function (event, model) {
									if (ScriptUtil.version >= 2.0) {
										model.close(true);
									} else {
										$(this).inforDialog("close");
									}
								}
							}
							]
						};
						if (ScriptUtil.version >= 2.0) {
							
							dialogOptions.afterOpen = function () {
								debugger;
								let content = $("#" + aGUID);
								_mylocal.getFile(pid, content);
							};
						}
						else {
							dialogOptions.open = function () {
								let content = $("#" + aGUID);
								_mylocal.getFile(pid, content);
							};
                        }
					}
					this.displayDialog(message, dialogOptions);
					if (this.gController.ShowMessageInStatusBar) {
						this.gController.ShowMessageInStatusBar("Finished");
					}
				}
				else {
					if (aState < 2) {
						this.getJSONFromIDM(aGUID, aState + 1);
					}
					else {
						this.gController.ShowMessage("No data found in IDM");
					}
				}
			}).catch((response: IonApiResponse) => {
				this.gController.ShowMessage("Exception: " + response.status + " " + response.statusText);
			});
		}
		else {
			// no record selected
		}
		if (this.gController.ShowMessageInStatusBar) {
			this.gController.ShowMessageInStatusBar("Finished");
		}
	}

	private detailButtonClicked(): void {
		let guid = ListControl.ListView.GetValueByColumnName("GUID");

		if (this.gController.ShowMessageInStatusBar) {
			this.gController.ShowMessageInStatusBar("Retrieving Data");
		}

		this.getJSONFromIDM(guid, 0);
	}

	// retrieve the actual data sent, this could be an XML file, or or could be csv
	public getFile(aPID, aContent): void {
		let request: IonApiRequest = {
			url: `/IDM/api/items/${aPID}/resource/stream/`,
			headers: { Accept: "application/octet-stream;charset=utf-8"},
			method: "GET",
			record: {
				$webdav: "false"
			}

		}
		this.gionapiService.execute(request).then((response: IonApiResponse) => {
			let priorityData: string[] = [];
			let decodedBody = "";

			let message = "";

			if (response.data) {

				try {
					let indata = response.data;

					if (indata) {
						let jsonString = "";
						try {
							jsonString = JSON.stringify(indata);
						}
						catch (jex) {}
						
						if (indata.input && indata.input.length > 0 && indata.input[0] && indata.input[0].data && indata.input[0].data.base64) {
							decodedBody = atob(indata.input[0].data.base64);
						}
						
						if (indata.input && indata.input[0].template && indata.input[0].template.priority && indata.input[0].template.priority.length > 0) {
							message += `<div><h2>Priorites</h2>`;
							for (let i = 0; i < indata.input[0].template.priority.length; i++) {
								let currentTemplate = indata.input[0].template.priority[i];
								if (currentTemplate.type === "xquery") {
									priorityData.push(currentTemplate.xquery);
									message += `<div class="row"><div class="twelve columns">${currentTemplate.xquery}</div></div>`;
								}
							}
							message += `</div>`;
						}
						if (indata.input && indata.input[0].csvs && indata.input[0].csvs.length > 0) {
							for (let i = 0; i < indata.input[0].csvs.length; i++) {
								let currentTemplate = indata.input[0].csvs[i];
								if (currentTemplate.type === "data") {
									decodedBody = atob(indata.input[0].csvs[i].base64);
									//message += `<div class="row"><div class="twelve columns">${currentTemplate.xquery}</div></div>`;
								}
							}
						}
						if (indata.input && indata.input[0].sheets && indata.input[0].sheets.length > 0) {
							message += `<div><h2>Sheets</h2>`;
							for (let i = 0; i < indata.input[0].sheets.length; i++) {
								message += `<div class="row">${indata.input[0].sheets[i]}</div>`;
							}
							message += `</div>`;
						}
						if (indata.targets && indata.targets.length > 0) {
							let targetType = "";
							message += `<div><h2>Targets</h2>`;

							for (let i = 0; i < indata.targets.length; i++) {
								let currentTarget = indata.targets[i];
								let currentTargetType = currentTarget.type;
								message += `<div class="row"><div class="twelve columns"><b>Target Type:</b> ${currentTargetType}</div></div>`;

								if (currentTargetType === "email") {
									let currentTargetTo = currentTarget.to;
									let currentTargetcc = currentTarget.cc;
									let currentTargetSubject = currentTarget.subject;
									let currentTargetBody = currentTarget.body;
									let currentTargetFrom = currentTarget.from;

									if (currentTargetTo && currentTargetTo.length > 0) {
										message += `<div class="row"><div class="twelve columns"><b>To:</b> ${currentTargetTo}</div></div>`;
									}
									if (currentTargetcc && currentTargetcc.length > 0) {
										message += `<div class="row"><div class="twelve columns"><b>CC:</b> ${currentTargetcc}</div></div>`;
									}
									if (currentTargetSubject && currentTargetSubject.length > 0) {
										message += `<div class="row"><div class="twelve columns"><b>Subject:</b> ${currentTargetSubject}</div></div>`;
									}
									if (currentTargetBody && currentTargetBody.length > 0) {
										message += `<div class="row"><div class="twelve columns"><b>Body:</b> ${currentTargetBody}</div></div>`;
									}
									if (currentTargetFrom && currentTargetFrom.length > 0) {
										message += `<div class="row"><div class="twelve columns"><b>From:</b> ${currentTargetFrom}</div></div>`;
									}
								}
								else if (currentTargetType === "print") {
									let currentTargetPrinterID = currentTarget.printerId;
									let currentTargetCopies = currentTarget.noOfCopies;

									if (currentTargetPrinterID && currentTargetPrinterID.length > 0) {
										message += `<div class="row"><div class="twelve columns"><b>Printer ID:</b> ${currentTargetPrinterID}</div></div>`;
									}
									if (currentTargetCopies && currentTargetCopies.length > 0) {
										message += `<div class="row"><div class="twelve columns"><b>Copies:</b> ${currentTargetCopies}</div></div>`;
									}
								}
								message += "<br/>"
							}
							message += `</div>`;
						}

						if (jsonString && jsonString.length > 0) {
							message += `<br/><h3>Resource JSON</h3><div class="field" style="width: 90%"><textarea class="textarea" readonly="true" style="width: 90%; font-size: 12px; height: 40px" >${jsonString}</textarea></div><br/>`;
						}
						

						message += `<h3>Resource Decoded Body</h3><div class="field" style="width: 90%"><textarea class="textarea" readonly="true" style="width: 90%; font-size: 12px; height: 40px" >${decodedBody}</textarea></div>`;

						if (aContent) {
							this.loadingState = "";
							aContent.html(message);
						}
					}

				}
				catch (ex) {
					// failed to parse JSON result
				}

			}
			else {
				message = "<h2>Data not found</h2>";
			}
		}).catch((response: IonApiResponse) => {
			this.gController.ShowMessage("Exception: " + response.status + " " + response.statusText);
		});
	}


	private displayDialog(aDialogContent, aDialogOptions) {
		
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
				}
				,

				buttons: {
					Ok: function () {
						$(this).inforDialog("destroy").remove();
					}
				}
			};
		}

		if (ScriptUtil.version >= 2.0) {
			let content = $(aDialogContent);
			H5ControlUtil.H5Dialog.CreateDialogElement(content[0], aDialogOptions);
		}
		else {
			$('<div>' + aDialogContent + '</div>').inforMessageDialog(aDialogOptions);
		}
	}

	private addControls() {
		this.gDetailButton = this.gContent.AddElement(this.addButtonControl(this.gDetailButtonTitle, this.gDetailButtonID, this.gDetailButtonLeft, this.gDetailButtonTop, undefined));

		this.gDetailButton.click({}, () => { this.detailButtonClicked() });
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
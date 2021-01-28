/**
 * Name: testDialog
 * Panel: any
 * Arguments: none
 * 
 * test a v2 dialog
 * 
*/

class testDialog {
	// standard variables to be populated from framework
	private gController: IInstanceController;
	private gDebug: IScriptLog;
	private gContent: IContentElement;
	private args;


	constructor(args: IScriptArgs) {
		this.gController = args.controller;
		this.gDebug = args.log;
		this.gContent = args.controller.GetContentElement();
	}

	private static Init(args: IScriptArgs) {
		new testDialog(args).run();
	}

	private run(): void {
		this.gDebug.Info("MUA Scripting Version: " + ScriptUtil.version);
		let message;
		let version = ScriptUtil.version;
		if (version >= 2.0) {
			message = $(`<div><h2>This is a V${version} Dialog</h2>`);
		}
		else {
			message = `<div><h2>This is an original Dialog</h2>`;
		}
		this.displayDialog(message, undefined);
	}

	private displayDialog(aDialogContent, aDialogOptions) {
		debugger;
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
			H5ControlUtil.H5Dialog.CreateDialogElement(aDialogContent[0], aDialogOptions);
		}
		else {
			$('<div>' + aDialogContent + '</div>').inforMessageDialog(aDialogOptions);
		}
	}
}
/**
 * Name: testDialog
 * Panel: any
 * Arguments: none
 *
 * test a v2 dialog
 *
*/
var testDialog = /** @class */ (function () {
    function testDialog(args) {
        this.gController = args.controller;
        this.gDebug = args.log;
        this.gContent = args.controller.GetContentElement();
    }
    testDialog.Init = function (args) {
        new testDialog(args).run();
    };
    testDialog.prototype.run = function () {
        this.gDebug.Info("MUA Scripting Version: " + ScriptUtil.version);
        var message;
        var version = ScriptUtil.version;
        if (version >= 2.0) {
            message = $("<div><h2>This is a V" + version + " Dialog</h2>");
        }
        else {
            message = "<div><h2>This is an original Dialog</h2>";
        }
        this.displayDialog(message, undefined);
    };
    testDialog.prototype.displayDialog = function (aDialogContent, aDialogOptions) {
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
    return testDialog;
}());
//# sourceMappingURL=testDialog.js.map
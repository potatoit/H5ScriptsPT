/**
 * Name: testIONAPI
 * Panel: any
 * Arguments: none
 *
 * Curent the that  IonApiService.Current exists
 *
*/
var testIONAPI = /** @class */ (function () {
    function testIONAPI(args) {
        this.gController = args.controller;
        this.gDebug = args.log;
        this.gContent = args.controller.GetContentElement();
    }
    testIONAPI.Init = function (args) {
        new testIONAPI(args).run();
    };
    testIONAPI.prototype.run = function () {
        //debugger;
        var _this = this;
        this.gDebug.Info("Script Util Version: " + ScriptUtil.version);
        if (IonApiService.Current) {
            this.gDebug.Info("IonApi is set");
            var ionapiservice = IonApiService.Current;
        }
        else {
            var ionapiservice = IonApiService;
            this.gDebug.Error("IonApi current not set");
        }
        if (ionapiservice) {
            // we should use the native M3 APIs here, but we want to test the IONAPIs and this is an easy API
            var request = {
                url: "/M3/m3api-rest/v2/execute/GENERAL/GetCurrentUser",
                method: "GET",
                record: {
                    $webdav: "false"
                }
            };
            ionapiservice.execute(request).then(function (response) {
                var message = "Execute completed";
                if (response.data && response.data.results && response.data.results.length > 0 && response.data.results[0].records && response.data.results[0].records.length > 0) {
                    message += (": " + response.data.results[0].records[0].TEID + " / " + response.data.results[0].records[0].USER + " / " + response.data.results[0].records[0].PRUS);
                }
                _this.gController.ShowMessage(message);
            }).catch(function (response) {
                _this.gController.ShowMessage("Exception: " + response.status + " " + response.statusText);
            });
        }
    };
    return testIONAPI;
}());
//# sourceMappingURL=testIONAPI.js.map
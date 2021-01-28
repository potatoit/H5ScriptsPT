/**
 * Name: testIONAPI
 * Panel: any
 * Arguments: none
 * 
 * Curent the that  IonApiService.Current exists
 * 
*/

class testIONAPI {
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
		new testIONAPI(args).run();
	}

	private run(): void {
		//debugger;

		this.gDebug.Info("Script Util Version: " + ScriptUtil.version);

		if (IonApiService.Current) {
			this.gDebug.Info("IonApi is set");
			var ionapiservice: any = IonApiService.Current;
		}
		else {
			var ionapiservice : any = IonApiService;
			this.gDebug.Error("IonApi current not set");
		}

		if (ionapiservice) {
			// we should use the native M3 APIs here, but we want to test the IONAPIs and this is an easy API
			let request: IonApiRequest = {
				url: `/M3/m3api-rest/v2/execute/GENERAL/GetCurrentUser`,
				method: "GET",
				record: {
					$webdav: "false"
				}
			}
			ionapiservice.execute(request).then((response: IonApiResponse) => {
				let message = "Execute completed";

				if (response.data && response.data.results && response.data.results.length > 0 && response.data.results[0].records && response.data.results[0].records.length > 0) {
					message += (": " + response.data.results[0].records[0].TEID + " / " + response.data.results[0].records[0].USER + " / " + response.data.results[0].records[0].PRUS);
				}

				this.gController.ShowMessage(message)
			}).catch((response: IonApiResponse) => {
				this.gController.ShowMessage("Exception: " + response.status + " " + response.statusText);
			});

		}

	}


}
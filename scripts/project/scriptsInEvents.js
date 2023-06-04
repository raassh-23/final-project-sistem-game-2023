function generateRandomName(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    while (text.length < length) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return text;
}



const scriptsInEvents = {

	async Functions_es_Event1_Act1(runtime, localVars)
	{
		runtime.setReturnValue(generateRandomName(localVars.length))
	}

};

self.C3.ScriptsInEvents = scriptsInEvents;


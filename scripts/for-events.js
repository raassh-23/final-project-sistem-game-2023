function generateRandomName(length) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    while (text.length < length) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return text;
}

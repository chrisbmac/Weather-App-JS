// randomly generates a number between the range of low and high
function getRandom(low = 1, high = 10) {
	let randomNumber;
	// calculate random number
    randomNumber = Math.floor(Math.random() * (high - low)) + low;
	// return random number
	return randomNumber;
}
/*function addKey(functionToCall, myKeyCode = 13) {
    document.addEventListener("keydown", _onKeyDown);
    const _onKeyDown = (e) => e.keyCode =myKeyCode(e.preventDefault, functionToCall) 
      
    //return functionToCall, myKeyCode;
}*/
/*function addKey() {
    document.addEventListener("keydown", (functionToCall, myKeyCode = 13) => _onKeyDown);
   
    // return functionToCall, myKeyCode;
}*/


// ---------------------------------------- NEW METHOD MODULE
//function addKey() {
//    return document.addEventListener("keydown", _onKeyDown =>(functionToCall, myKeyCode = 13));
//}
/*function _onKeyDown(e) {
    // is the key released the specified key?
    
    if (e.keyCode === myKeyCode) {
        // pressing the enter key will force some browsers to refresh
        // this command stops the event from going further
        e.preventDefault();
        // call provided callback to do everything else that needs to be done
        functionToCall();
        // this also helps the event from propagating in some browsers
        return false;
    }
}*/
/*let cookieArray = document.cookie.split(";");
// remove blank spaces from all elements of cookieArray
cookieArray = cookieArray.map(cookie => cookie.trim());
// find cookie with name and set value
cookieArray.forEach(cookie => {
    if (cookie.split("=")[0] == name) {
        value = cookie.split("=")[1];
    }    
});*/
// -------------------------------------------------------
function addKey(functionToCall, myKeyCode = 13) {
    //let _onKeyDown = () => {if (e.keyCode == e.target) functionToCall();};
    document.addEventListener("keydown", (e) => { if (e.keyCode == myKeyCode) { 
        e.preventDefault();
        functionToCall();
    //const _onKeyDown = (e) => e.keyCode = (e.preventDefault, functionToCall); 
    
    
    
    //return functionToCall, myKeyCode;
    }
});
}
// variables and constants can also be exported in the module
// useful for sharing constants across all JS files
const EASTER_EGG = "Sean Morrow added this easter egg!";
function getJSONData(retrieveScript, success, failure) {
    // fetch(retrieveScript)
    //     .then(function(response) {
    //         //console.log(response);
    //         return response.json();
    //     })
    //     .then(function(jsonData) {
    //         success(jsonData);
    //     })
    //     .catch(function(err) {
    //         failure();
    //     });

    fetch(retrieveScript)
        .then(response => response.json())
        .then(jsonData => success(jsonData))
        .catch(err => failure());
}
export {getRandom, EASTER_EGG, addKey};
/*function guessRepeatValidate(userGuess) {
    return !(guessArchive.some(pastGuess => (pastGuess == userGuess)));
}*/
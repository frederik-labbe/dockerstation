var Console = {
    promptPosition: 0
};

function initConsole(dockerId) {
    var consoleElement = _e('console');
    consoleElement.focus();
    
    displayPrompt(consoleElement, dockerId);
    
    consoleElement.addEventListener('keydown', function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            var cmd = consoleElement.value.substring(Console.promptPosition);
            runCommand(cmd);
            displayPrompt(consoleElement, dockerId); //TODO: wait for socket response for command
        }
    }, false);
    
}

function runCommand(cmd) {
    //TODO: send query to socket
}

function displayPrompt(consoleElement, dockerId) {
    consoleElement.value += '\ndockerstation@' + dockerId + ': ';
    Console.promptPosition = consoleElement.value.length;
}

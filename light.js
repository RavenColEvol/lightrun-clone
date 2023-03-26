const inspector = require('inspector');
const path = require('path');
// Initialize Inspector
const session = new inspector.Session();
const breakPointScript = {};

session.connect();
session.post("Debugger.enable");

setConsole('index.js', 6, 'console.log(name)')

function setConsole(filename, lineNumber, script) {
  const breakpointObject = {
    url: "file://" + path.join(__dirname, filename),
    lineNumber,
  }
  session.post(
    "Debugger.setBreakpointByUrl",
    breakpointObject,
    (err, res) => {
      breakPointScript[res.locations[0]] = script;
    }
  );
}

session.on('Debugger.paused', async (event) => {
  const contextId = event.params.callFrames[0].callFrameId;
  session.post('Debugger.evaluateOnCallFrame', {
    expression: breakPointScript[event.params.callFrames[0].location],
    callFrameId: contextId
  });
  // Resume script execution
  session.post('Debugger.resume');
});

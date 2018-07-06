var childProcess = require('child_process')
    ,tasks = (tasks=>tasks.length?tasks:['copy','less','uglify'])(process.argv.slice(2))
    ,promise = Promise.resolve();

tasks.forEach(task=>{
  promise = promise.then(runScript.bind(null,'./task/'+task));
});

function runScript(scriptPath) {
	return new Promise(function(resolve,reject){
    var invoked = false
        ,process = childProcess.fork(scriptPath);
    process.on('error',err=>{
        if (invoked) return;
        invoked = true;
        reject(err);
    });
    process.on('exit',code=>{
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        resolve(err);
    });
	});
}
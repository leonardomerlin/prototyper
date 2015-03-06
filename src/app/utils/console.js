window.FLAGS = {
  LOG_LEVEL: {
    'DEBUG': true,
    'INFO': true,
    'WARN': true,
    'ERROR': true,
    'DEFAULT': true,
    'GROUP': true
  }
};

// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  if(!FLAGS.LOG_LEVEL.DEFAULT){
    return;
  }
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments) );
  }
};

window.debug = function(){
  if(!FLAGS.LOG_LEVEL.DEBUG){
    return;
  }
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.debug( Array.prototype.slice.call(arguments) );
  }
};

window.info = function(){
  if(!FLAGS.LOG_LEVEL.INFO){
    return;
  }
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.info( Array.prototype.slice.call(arguments) );
  }
};

window.warn = function(){
  if(!FLAGS.LOG_LEVEL.WARN){
    return;
  }
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.warn( Array.prototype.slice.call(arguments) );
  }
};

window.error = function(){
  if(!FLAGS.LOG_LEVEL.ERROR){
    return;
  }
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.error( Array.prototype.slice.call(arguments) );
  }
};

window.logGroup = function(){
  if(!FLAGS.LOG_LEVEL.GROUP){
    return;
  }
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.groupCollapsed( Array.prototype.slice.call(arguments) );
  }
};

window.logGroupEnd = function(){
  if(!FLAGS.LOG_LEVEL.GROUP){
    return;
  }
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console){
    console.groupEnd( Array.prototype.slice.call(arguments) );
  }
};


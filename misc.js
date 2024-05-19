void function(){


  /**
   * 
   */

  var out = {

    /* get global scope  - based on this - https://morioh.com/a/4ca3c63dbc0c/a-horrifying-globalthis-polyfill-in-universal-javascript */
    getGlobalScope : function(){
      ({}).constructor.prototype.__getGlobalScope__ = function(){ return this };
      var scope = __getGlobalScope__();
      delete ({}).constructor.prototype.__getGlobalScope__;
      return scope;
    }

  };

  var key;
  for( key in out ){
    esx[key] = out[key];
  }

}()
void function(){

  "use strict";

  function PromiseLike( callback ){

    if( typeof callback !== "function" ){
      throw "callback for PromiseLike must be a function"
    }

    var resolveCallback, rejectCallback;

    this["then"] = function( cb ){
      resolveCallback = cb;
      return this;
    };

    this["catch"] = function( cb ){
      rejectCallback = cb;
      return this;
    };

    var errored = false;

    function resolve( val ){
      if( !errored ){
        typeof resolveCallback === "function" && resolveCallback( val );
      }
    }

    function reject( val ){
      if( !errored ){
        errored = true;
        typeof rejectCallback === "function" ? rejectCallback( val ) : console.error("unhandled promiselike rejection: ",val);
      }
    }

    /* needs to be at least 1 event cycle to run then and catch, otherwise throws an error! */
    setTimeout(function(){
      callback( resolve, reject );
    });

  }
  
  esx.PromiseLike = PromiseLike;

}()
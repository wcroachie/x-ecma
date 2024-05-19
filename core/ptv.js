void function(){

  "use strict";

  var out = {

    wrapPrimitive : function( any ){
      if( any === null ){
        throw "cannot create object wrapper for null"
      }
      if( typeof any === "undefined" ){
        throw "cannot create object wrapper for undefined"
      }
      return new {}.constructor( any );
    },

    toStringUsingObject : function( any ){
      if( any === null ){
        return "[object Null]"
      }
      if( typeof any === "undefined" ){
        return "[object Undefined]"
      }
      var wrapped = this.wrapPrimitive( any );
      wrapped.toString = {}.constructor.prototype.toString;
      return wrapped.toString();
    },

    toStringUsingFunction : function( any ){
      var wrapped = this.wrapPrimitive( any );
      wrapped.toString = function(){}.constructor.prototype.toString;
      return wrapped.toString();
    },

    getStringTag : function( any ){
      var tag = this.toStringUsingObject( any );
      /* [object XX...(n characters)...X] */
      var i;
      var out = "";
      for( i=8; i<tag.length-1; i++ ){
        out += tag[i];
      }
      return out;
    },

    setStringTag : function( target, str ){

      if( typeof str !== "string" ){
        throw "arg at index 1 must be a string"
      }

      /* check if Symbols are implemented */
      if( typeof Symbol !== "function" ){
        return false;
      }

      if( typeof Symbol.toStringTag !== "symbol" ){
        return false;
      }

      /* check for "defineProperty in Object constructor and use if available" */
      if( typeof ({}).constructor.defineProperty === "function" ){
        ({}).constructor.defineProperty(
          target,
          Symbol.toStringTag,
          {
            get : function(){
              return str
            }
          }
        );
      /* check for "__defineGetter__" and used if available */
      }else if( typeof target.__defineGetter__ === "function" ){
        target.__defineGetter__(
          Symbol.toStringTag,
          function(){
            return str
          }
        );
      }else{
        target[ Symbol.toStringTag ] = str;
      }

      /* see if it was successful. return true if successful, otherwise return false. */
      var gottenTag = this.getStringTag( target );
      if( gottenTag === str ){
        return true;
      }else{
        return false;
      }

    },



  };

  esx.ptv = out;
  
}()
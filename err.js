/**
 * NOTE - THE CODE BELOW MUST BE RAN IN THE GLOBAL
 * SCOPE SO AS TO GET THE SHORTEST ERROR STACK
*/

esx.err = {};

/**
 * some parsers add an extra line of information at the
 * beginning of every error stack, others do not do this.
 * the following is an attempt to mitigate this problem
 * by throwing an error in the scope this script is ran
 * in (globally, ideally), counting the lines in the stack,
 * and removing that many lines from the beginning of every
 * error thrown within esx.generateStackTrace. note that
 * esx.generateStackTrace must be defined in the same scope
 * as the error thrown in, due to safari adding an extra
 * line for the usual closure esx methods are defined in,
 * so there is no closure here.
 */

/**
 * purposefully throw an error by trying to
 * access a property from null. assuming there
 * may not be access to a global Error constructor.
 * in all versions of JS that use try...catch,
 * this should generate an error or exception-like
 * object that should have a stack. if there is
 * no stack property, the caught value is coerced
 * to a string.
 **/

try{
  null.$ = 0;
}catch(e){
  if( typeof e === "undefined" ){
    esx.err.GLOBAL_SCOPE_ERROR_STACK = "undefined";
  }else{
    if( typeof e === "object" && e !== null && "stack" in e ){
      esx.err.GLOBAL_SCOPE_ERROR_STACK = e.stack;
    }else{
      esx.err.GLOBAL_SCOPE_ERROR_STACK = e;
    }
  }
}

/* coerce to string */
esx.err.GLOBAL_SCOPE_ERROR_STACK += "";

esx.err.generateStackTrace = function(){
  var stack;
  try{
    null.$ = 0;
  }catch(e){
    if( typeof e === "undefined" ){
      stack = "undefined";
    }else{
      if( typeof e === "object" && e !== null && "stack" in e ){
        stack = e.stack;
      }else{
        stack = e;
      }
    }
  }
  /* coerce to string */
  stack += "";
  return stack;
};

void function(){

  "use strict";

  /**
   * @requires ptv
   * @requires str
   * @requires arr
   * @requires url
   */

  var out = {

    normalizeError : function( any ){
      /* these keys should be inherent to any Error instance */
      var keys = ["cause","columnNumber","fileName","lineNumber","message","name","stack"];
      var clone = {};
      var i, key;
      /* if null or undefined, attempting to access the values will cause an error, so just set them as undefined */
      if( any === null || typeof any === "undefined" ){
        for( i=0; i<keys.length; i++ ){
          key = keys[i];
          clone[key] = undefined;
        }
      /* otherwise copy over what values we can */
      }else{
        for( i=0; i<keys.length; i++ ){
          key = keys[i];
          clone[key] = any[key];
        }
      }
      clone.type =  esx.ptv.getStringTag( any );
      clone.stringed = any + "";
      return clone;
    },
    
    normalizeDOMException : function( any ){
      /* these keys should be inherent to any DOMException instance */
      var keys = ["code","message","name","stack"];
      var clone = {};
      var i, key;
      /* if null or undefined, attempting to access the values will cause an error, so just set them as undefined */
      if( any === null || typeof any === "undefined" ){
        for( i=0; i<keys.length; i++ ){
          key = keys[i];
          clone[key] = undefined;
        }
      /* otherwise copy over what values we can */
      }else{
        for( i=0; i<keys.length; i++ ){
          key = keys[i];
          clone[key] = any[key];
        }
      }
      clone.type =  esx.ptv.getStringTag( any );
      clone.stringed = any + "";
      return clone;
    },

    parseStackLine : function( line ){

      if( typeof line !== "string" ){
        throw "line must be a string"
      }
  
      if( line[line.length - 1] === ")" ){
        line = esx.str.String_slice( line, 0, -1 );
        if( line.indexOf("(") !== -1 ){
          line = esx.str.String_slice( line, line.indexOf("(") + 1 );
        }
      }
  
      var betweenColons = esx.str.String_split( line, ":" );
      var lineno=null, colno=null;
      
      if(
        esx.str.canBeNum( betweenColons[betweenColons.length - 1 ] ) &&
        esx.str.canBeNum( betweenColons[betweenColons.length - 2 ] )
      ){
        colno = esx.arr.Array_pop( betweenColons ) * 1;
        lineno = esx.arr.Array_pop( betweenColons ) * 1;
      }
  
      line = esx.arr.Array_join( betweenColons, ":" );
  
      line = esx.str.String_trim( line );
  
      if( esx.arr.Array_slice( line, -13 ) === "[native code]"){
        line = "[native code]"
      }else{
        line = esx.arr.Array_pop( esx.str.String_split(line," ") );
        line = esx.arr.Array_pop( esx.str.String_split(line,"@") );
        line = esx.str.String_split( line, "#" )[0];
        line = esx.str.String_split( line, "?" )[0];
        var parentUri = esx.url.getLocalParentPath();
        var relativeDir = esx.arr.Array_pop( esx.arr.Array_split( line, parentUri ) );
        line = relativeDir;
      }
  
      var obj = {
        filename : line,
        lineno : lineno,
        colno : colno
      };
  
      return obj;
  
    }

  };

  var key;
  for( key in out ){
    esx.err[key] = out[key];
  }

}()
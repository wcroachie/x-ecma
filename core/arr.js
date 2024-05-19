void function(){

  "use strict";

  /**
   * @requires typechk
   */

  function deleteLastItem( arr ){
    var len = arr.length;
    if( len === 0 ){
      return;
    }
    delete arr[ len - 1 ];
    arr.length = len - 1;
  }

  var out = {
    
    Array_indexOf : function( arr, item ){
      if( typeof arr === "string" ){
        throw "if looking for index in a string, please use built-in method String.indexOf"
      }
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      var i;
      for( i=0; i<arr.length; i++ ){
        /* only check non-empty slots */
        if( (i in arr) && (arr[i] === item) ){
          return i;
        }
      }
      return -1;
    },

    Array_pop : function( arr ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      var item = arr[arr.length - 1];
      deleteLastItem( arr );
      return item;
    },

    Array_shift : function( arr ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      var item = arr[0];
      var i;
      for( i=0; i<arr.length; i++ ){
        /* if it was not an empty slot, set it */
        if( (i + 1) in arr ){
          arr[i] = arr[i+1];
        }else{
          /* if it was an empty slot, delete */
          delete arr[i];
        }
      }
      deleteLastItem( arr );
      return item;
    },

    Array_push : function( arr, itemN ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      var i, item;
      for( i=1; i<arguments.length; i++ ){
        item = arguments[i];
        arr[ arr.length ] = item;
      }
      return arr.length;
    },

    Array_unshift : function( arr, itemN ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      var originalLen = arr.length;
      var offset = arguments.length-1;
      var i;
      for( i=arr.length+offset-1; i>=0; i-- ){
        if( (i - offset) in arr ){
          arr[i] = arr[i - offset];
        }else{
          delete arr[i];
        }
      }
      for( i=0; i<offset; i++ ){
        arr[i] = arguments[i+1];
      }
      /**
       * if the last index becomes an empty slot,
       * make sure to set the length again to
       * restore the empty slots on the end,
       * otherwise it may automatically truncate
       **/
      arr.length = originalLen + offset;
      return arr.length;
    },

    /* join an array of items by a string. coerces items to strings. */
    Array_join : function( arr, str ){ 
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      /* mimic behavior of built-in by coercing to string if second arg is undefined */
      if( typeof str === "undefined" ){
        return arr + ""
      }else{
        str += "";
      }
      var out = "";
      var i;
      for( i=0; i<arr.length; i++ ){
        if( i in arr ){
          out += arr[i];
        }
        if( i < arr.length - 1 ){
          out += str;
        }
      }
      return out;
    },

    /* callback args - (e,n,a) - e=item, n=index, a=array */
    Array_filter : function( arr, callback ){ 
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      if( typeof callback !== "function" ){
        throw "arg at index 1 must be a function"
      }
      var out = [];
      var i, item, keep;
      for( i=0; i<arr.length; i++ ){
        if( i in arr ){
          item = arr[i];
          keep = !!callback( item, i, arr );
          if( keep ){
            out[ out.length ] = item;
          }
        }
      }
      return out;
    },

    /* callback args - (e,n,a) - e=item, n=index, a=array */
    Array_map : function( arr, callback ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      if( typeof callback !== "function" ){
        throw "arg at index 1 must be a function"
      }
      var out = [];
      out.length = arr.length;
      var i, item, result;
      for( i=0; i<arr.length; i++ ){
        if( i in arr ){
          item = arr[i];
          result = callback( item, i, arr );
          out[ i ] = result;
        }
      }
      return out;
    },

    Array_slice : function( arr, start, end ){
    
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }

      if( typeof start !== "undefined" ){
        if( !esx.typechk.isIntegerNumber(start) ){
          throw "if not undefined, arg at index 1 must be an integer"
        }
      }else{
        /* is start is undefined, it is 0 */
        start = 0;
      }

      if( typeof end !== "undefined" ){
        if( !esx.typechk.isIntegerNumber(end) ){
          throw "if not undefined, arg at index 2 must be an integer"
        }
      }else{
        /* if end is undefined, it is str.length */
        end = arr.length;
      }
      
      if( end > arr.length ){
        end = arr.length;
      }
  
      if( start >= arr.length ){
        return [];
      }
  
      if( start < -arr.length ){
        start = 0;
      }
  
      if( start < 0 ){
        start = arr.length + start;
      }
      
      if( end < 0 ){
        end = arr.length + end;
      }
  
      if( end <= start ){
        return [];
      }
  
      var out = [];
      var i;
      for( i=start; i<end; i++ ){
        if( i in arr ){
          out[ out.length ] = arr[i];
        }else{
          out.length += 1;
        }
      }
  
      return out;
  
    },

    shallowCopyArr : function( arr ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      var arr2 = [];
      var i;
      for( i=0; i<arr.length; i++ ){
        /* only define non-empty slots */
        if( i in arr ){
          arr2[i] = arr[i];
        }
      }
      return arr2;
    },

    compareArrsStrict : function( arr0, arrN ){
    
      if( arguments.length <=1 ){
        return true;
      }
      var i, arr, j;
      /* first check to make sure all args are arrays, and throw early if not */
      for( i=0; i<arguments.length; i++ ){
        arr = arguments[i];
        if( arr instanceof [].constructor === false ){
          throw "all args must be instanceof Array"
        }
      }
      /* now actually begin comparing */
      for( i=1; i<arguments.length; i++ ){
        if( arr === arr0 ){
          continue;
        }
        if( arr.length !== arr0.length ){
          return false;
        }
        for( j=0; j<arr0.length; j++ ){
          /* undefined vs empty slot */
          if( (j in arr) !== (j in arr0) ){
            return false;
          }
          /* okay, actually compare the value */
          if( arr[j] !== arr0[j] ){
            return false;
          }
        }
      }
      return true;
    },

    /* break an array into chunks equal to maxChunkLength or less and greater than zero */
    chunkArr : function( arr, maxChunkLength ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      if( !esx.typechk.isIntegerNumber(maxChunkLength) || maxChunkLength <= 0 ){
        throw "arg at index 1 must be an integer greater than zero"
      }
      var chunks = [[]];
      var counter = 0;
      var i, currChunk;
      for( i=0; i<arr.length; i++ ){
        currChunk = chunks[ chunks.length - 1 ];
        if( i in arr ){
          currChunk[ currChunk.length ] = arr[i];
        }else{
          /* empty slot? just increase the length by 1 */
          currChunk.length ++;
        }
        counter ++;
        if( counter === maxChunkLength ){
          chunks[ chunks.length ] = [];
          counter = 0;
        }
      }
      /* if last chunk length is 0, pop it off */
      if( !chunks[chunks.length-1].length ){
        this.Array_pop( chunks );
      }
      return chunks;
    },

    /* concatenate 2 or more arrays. returns a new array */
    concatArrs : function( arrN ){
      var out = [];
      var i, arr, j, item;
      /* first check to make sure all args are arrays, and throw early if not */
      for( i=0; i<arguments.length; i++ ){
        arr = arguments[i];
        if( arr instanceof [].constructor === false ){
          throw "all args must be instanceof Array"
        }
      }
      for( i=0; i<arguments.length; i++ ){
        arr = arguments[i];
        for( j=0; j<arr.length; j++ ){
          if( j in arr ){
            item = arr[j];
            out[out.length] = item;
          }else{
            /* empty slot, just increase the length by 1 */
            out.length ++;
          }
        }
      }
      return out;
    },

    /**
     * combine an array of arrays into a single
     * array (like concat but uses a single arg
     * for convenience). returns a new array.
     **/
    combineArrs : function( arrs ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      var out = [];
      var i, arr, j, item;
      /* first check to make sure all items are arrays, and throw early if not */
      for( i=0; i<arrs.length; i++ ){
        arr = arrs[i];
        if( arr instanceof [].constructor === false ){
          throw "all items in this Array must be instanceof Array"
        }
      }
      for( i=0; i<arrs.length; i++ ){
        arr = arrs[i];
        for( j=0; j<arr.length; j++ ){
          if( j in arr ){
            item = arr[j];
            out[out.length] = item;
          }else{
            /* empty slot, just increase the length by 1 */
            out.length ++;
          }
        }
      }
      return out;
    },


    /* naive sum of all items in the array. if acc becomes NaN or infinite it exits early. */
    sumArr : function( arr ){
      if( arr instanceof [].constructor === false ){
        throw "arg at index 0 must be an array"
      }
      var acc = 0;
      var i, n;
      for( i=0; i<arr.length; i++ ){
        /* make sure not an empty slot */
        if( i in arr ){
          n = arr[i];
          n = +n; /* coerce to number */
          acc += n;
          if( !esx.typechk.isFiniteNumber(acc) ){
            break;
          }
        }
      }
      return acc;
    },

    /* get random index from a lengthy value */
    getRandomIndex : function( lengthy ){
      if( !esx.typechk.isLengthy( lengthy ) ){
        throw "arg at index 0 must be lengthy"
      }
      /* first get a list of all the slots in the array that are actually occupied */
      var indices = [];
      var i;
      for( i=0; i<lengthy.length; i++ ){
        if( i in lengthy ){
          indices[ indices.length ] = i;
        }
      }
      /* get a random value within the list of occupied indices */
      var index = Math.floor( Math.random() * indices.length );
      /* return the index in the array of indices (yes i know it sounds confusing sorry) */
      return indices[ index ];
    },

    getRandomItem : function( lengthy ){
      if( !esx.typechk.isLengthy( lengthy ) ){
        throw "arg at index 0 must be lengthy"
      }
      var index = this.getRandomIndex( lengthy );
      return lengthy[ index ];
    },

  };

  esx.arr = out;

}()
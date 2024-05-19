void function(){

  "use strict";

  /**
   * @requires arr
   */

  var out = {

    Object_keys : function( obj ){
      if( typeof obj !== "object" || obj === null ){
        throw "arg at index 0 must be a non-null object"
      }
      var keys = [];
      var key;
      for( key in obj ){
        keys[ keys.length ] = key;
      }
      return keys;
    },

    Object_values : function( obj ){
      if( typeof obj !== "object" || obj === null ){
        throw "arg at index 0 must be a non-null object"
      }
      var vals = [];
      var key, val;
      for( key in obj ){
        val = obj[ key ];
        vals[ vals.length ] = val;
      }
      return vals;
    },

    shallowCopyObj : function( obj ){
      if( typeof obj !== "object" || obj === null ){
        throw "arg at index 0 must be a non-null object"
      }
      var obj2 = {};
      var key;
      for( key in obj ){
        obj2[key] = obj[key];
      }
      return obj2;
    },

    compareObjsStrict : function( obj0, objN ){
      if( arguments.length <= 1 ){
        return true;
      }
      var i, obj;
      for( i=0; i<arguments.length; i++ ){
        obj = arguments[i];
        if( obj === null || typeof obj !== "object" ){
          throw "all args must be a non-null object"
        }
      }
      var obj0Keys = this.Object_keys( obj0 );
      var obj0Vals = this.Object_values( obj0 );
      var objKeys, objVals;
      for( i=1; i<arguments.length; i++ ){   
        obj = arguments[i];
        objKeys = this.Object_keys( obj );
        if( !esx.arr.compareArrsStrict( objKeys, obj0Keys ) ){
          return false
        }
        objVals = this.Object_values( obj );
        if( !esx.arr.compareArrsStrict( objVals, obj0Vals ) ){
          return false;
        }
      }
      return true;
    }
  };

  esx.obj = out;

}()
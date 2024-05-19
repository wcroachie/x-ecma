void function(){
  
  "use strict";

  var out = {

    Number_prototype_isNaN : function( any ){
      if( typeof any !== "number" ){
        return false;
      }
      return any !== any;
    },

    Number_prototype_isFinite : function( any ){
      if( typeof any !== "number" ){
        return false;
      }
      if( this.Number_prototype_isNaN( any ) ){
        return false;
      }
      return any !== (1/0) && any !== -(1/0);
    },

    Number_prototype_isInteger : function( any ){
      if( typeof any !== "number" ){
        return false;
      }
      if( !this.Number_prototype_isFinite( any ) ){
        return false;
      }
      if( any % 1 !== 0 ){
        return false;
      }
      return true;
    },
    
    /**
     * similar behavior to parseInt but only works with numbers
     * and has no radix, mimics internal JS behavior when passing
     * floats through functions that truncate them as ints in the
     * direction of zero. useful for doing similar stuff.
     **/
    snapInt : function( n ){
      if( !this.Number_prototype_isFinite( n ) ){
        throw "arg at index 0 must be a finite number"
      }
      if( this.Number_prototype_isInteger( n ) ){
        return n;
      }
      var _n = n;
      if( n < 0 ){
        _n *= -1;
      }
      var rem = _n % 1;
      _n -= rem;
      if( n < 0 ){
        _n *= -1;
      }
      return _n;
    },



    /**
     * any methods below are in the es1 spec but i'm including
     * it in here just in case. mine does not work on floats
     * though because i don't know how to do that (yet)
     */
    doNotUse : {

      /**
       * 
       * @todo - note that unlike the native method
       * this does not work on floats. fix this at
       * some point
       */
      Number_toString : function( num, radix ){
        if( !esx.num.Number_prototype_isInteger(num) ){
          throw "arg at index 0 must be an integer"
        }
        if( typeof radix !== "undefined" ){
          if( !esx.num.Number_prototype_isInteger(radix) ){
            throw "arg at index 1, if not undefined, must be an integer"
          }
        }else{
          /* if radix is undefined, default to 10 */
          radix = 10;
        }
        if( radix < 2 || radix > 36 ){
          throw "radix must be an integer at least 2 and no greater than 36"
        }
        var wasNegative = num < 0;
        if( wasNegative ){
          num *= -1;
        }
        var chars = "0123456789abcdefghijklmnopqrstuvwxyz";
        var n = num;
        var acc = "";
        var rem;
        while( n !== 0 ){
          rem = n % radix;
          acc = chars[rem] + acc;
          n -= rem;
          n /= radix;
        }
        if( wasNegative ){
          acc = "-" + acc;
        }
        return acc;
      }
      
    }

  };

  esx.num = out;

}()
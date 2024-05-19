void function(){

  "use strict";
  
  /**
   * @requires num
   * @requires ptv
   */

  var out = {
    isFalsy : function( any ){
      return !!any === false;
    },
    isTruthy : function( any ){
      return !!any === true;
    },
    isAny : function( any ){
      return true;
    },
    isZero : function( any ){
      return any === 0;
    },
    isPositiveZero : function( any ){
      return this.isZero( any ) && (1/any) === Infinity;
    },
    isNegativeZero : function( any ){
      return this.isZero( any ) && (1/any) === -Infinity;
    },
    isNull : function( any ){
      return any === null;
    },
    isEmptyString : function( any ){
      return any === "";
    },
    isUndefined : function( any ){
      return typeof any === "undefined";
    },
    isObject : function( any ){
      return !this.isNull( any ) && typeof any === "object";
    },
    isBoolean : function( any ){
      return typeof any === "boolean";
    },
    isNumber : function( any ){
      return typeof any === "number";
    },
    isBigInt : function( any ){
      return typeof any === "bigint";
    },
    isString : function( any ){
      return typeof any === "string";
    },
    isSymbol : function( any ){
      return typeof any === "symbol";
    },
    isFunction : function( any ){
      return typeof any === "function";
    },
    isClass : function( any ){
      return this.isFunction( any ) && ( esx.ptv.toStringUsingFunction( any ).indexOf("class") === 0 );
    },
    isArray : function( any ){
      return any instanceof [].constructor;
    },
    isNonZeroNumber : function( any ){
      return this.isNumber( any ) && any !== 0;
    },
    isNaNNumber : function( any ){
      return esx.num.Number_prototype_isNaN( any );
    },
    isRealNumber : function( any ){
      return this.isNumber( any ) && !this.isNaNNumber( any );
    },
    isFiniteNumber : function( any ){
      return esx.num.Number_prototype_isFinite( any );
    },
    isIntegerNumber : function( any ){
      return esx.num.Number_prototype_isInteger( any );
    },
    isFloatNumber : function( any ){
      return this.isFiniteNumber( any ) && !this.isIntegerNumber( any );
    },
    isPositiveNumber : function( any ){
      return this.isNumber( any ) && (any >= 0) && !this.isNegativeZero( any );
    },
    isNegativeNumber : function( any ){
      return this.isNumber( any ) && (any <= 0) && !this.isPositiveZero( any );
    },
    isNonEmptyString : function( any ){
      return this.isString( any ) && !this.isEmptyString( any );
    },
    isArguments : function( any ){
      return any instanceof arguments.constructor;
    },
    isLengthy : function( any ){
      return !this.isNull( any ) && !this.isUndefined( any ) && this.isPositiveNumber( any.length ) && this.isIntegerNumber( any.length );
    }
  };

  esx.typechk = out;

}()
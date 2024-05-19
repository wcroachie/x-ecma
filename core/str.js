void function(){

  "use strict";

  /**
   * @requires typechk
   * @requires arr
   * @requires chcodes
   */

  function pad( fromStart, str, maxlen, paddingString ){
    /* match behavior of built-in pad */
    if( paddingString === "" ){
      return str;
    }
    if( maxlen < str.length ){
      return str;
    }
    var padLen = maxlen - str.length;
    var paddingStringLen = paddingString.length;
    var i;
    var pad = "";
    for( i=0; i<padLen; i++ ){
      pad += paddingString[ i % paddingStringLen];
    }
    return fromStart ? (pad + str) : (str + pad);
  }

  var out = {

    /**
     * this leverages the nature of whitespace strings
     * returning 0 when unary-coerced to a number instead
     * of NaN
     **/
    String_trim : function( str ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      var sliceStart, sliceEnd;
      var i, acc="", ch;
      for( i=0; i<str.length; i++ ){
        ch = str[i];
        if( ch === "0" ){
          break;
        }
        if( +(acc + ch) !== 0 ){
          break;
        }
        acc += ch;
      }
      sliceStart = acc.length;
      acc = "";
      for( i=str.length-1; i>=0; i-- ){
        ch = str[i];
        if( ch === "0" ){
          break;
        }
        if( +(ch + acc) !== 0 ){
          break;
        }
        acc = ch + acc;
      }
      sliceEnd = -acc.length;
      if( sliceStart || sliceEnd ){
        return this.String_slice( str, sliceStart, sliceEnd || undefined );
      }
      return str;
    },

    String_slice : function( str, start, end ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      if( typeof start !== "undefined" ){
        if( !esx.typechk.isIntegerNumber( start ) ){
          throw "if not undefined, arg at index 1 must be an integer"
        }
      }else{
        /* is start is undefined, it is 0 */
        start = 0;
      }
      if( typeof end !== "undefined" ){
        if( !esx.typechk.isIntegerNumber( end ) ){
          throw "if not undefined, arg at index 2 must be an integer"
        }
      }else{
        /* if end is undefined, it is str.length */
        end = str.length;
      }
      if( end > str.length ){
        end = str.length;
      }
      if( start >= str.length ){
        return "";
      }
      if( start < -str.length ){
        start = 0;
      }
      if( start < 0 ){
        start = str.length + start;
      }
      if( end < 0 ){
        end = str.length + end;
      }
      if( end <= start ){
        return "";
      }
      var out = "";
      var i;
      for( i=start; i<end; i++ ){
        out += str[i];
      }
      return out;
    },

    String_split : function( str, substr ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      if( typeof substr !== "string" ){
        throw "arg at index 1 must be a string"
      }
      var pieces = []; 
      if( substr === "" ){
        var i;
        for( i=0; i<str.length; i++ ){
          pieces[ pieces.length ] = str[i]
        }
      }else{
        var piece;
        var addEmptyStringAtEnd = false;
        if( this.String_slice(str,-substr.length) === substr ){
          addEmptyStringAtEnd = true;
        }
        while( str.length ){
          if( str.indexOf(substr) === -1 ){
            pieces[ pieces.length ] = str;
            break;
          }
          piece = this.String_slice( str, 0, str.indexOf(substr) );
          pieces[ pieces.length ] = piece;
          str = this.String_slice( str, str.indexOf(substr) + substr.length );
        }
      }
      if( addEmptyStringAtEnd ){
        pieces[pieces.length] = "";
      }
      return pieces;
    },

    String_padStart : function( str, maxlen, paddingString ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      if( !esx.typechk.isIntegerNumber( maxlen ) ){
        throw "arg at index 1 must be an integer"
      }
      if( typeof paddingString!== "string" ){
        throw "arg at index 2 must be a string"
      }
      return pad( true, str, maxlen, paddingString );
    },

    
    String_padEnd : function( str, maxlen, paddingString ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      if( !esx.typechk.isIntegerNumber( maxlen ) ){
        throw "arg at index 1 must be an integer"
      }
      if( typeof paddingString!== "string" ){
        throw "arg at index 2 must be a string"
      }
      return pad( false, str, maxlen, paddingString );
    },

    String_repeat : function( str, times ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }  
      if( esx.typechk.isFalsy( times ) ){
        return "";
      }else{
        if( !esx.typechk.isIntegerNumber( times ) || times < 0 ){
          throw "arg at index 1, if not falsy, must be a positive integer";
        }
      }
      var i, out="";
      for( i=0; i<times; i++ ){
        out += str;
      }
      return out;
    },

    /**
     * unlike normal String.replace, this only works with a
     * string. no regexp. only replaces first occurence
     **/
    String_replace : function( str, substringToReplace, substitute ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      if( typeof substringToReplace !== "string" ){
        throw "arg at index 1 must be a string"
      }
      if( typeof substitute !== "string" ){
        throw "arg at index 1 must be a string"
      }
      var start = str.indexOf( substringToReplace );
      if( start === -1 ){
        return str;
      }
      var end = start + substringToReplace.length;
      var i, ch, out="";
      for( i=0; i<str.length; i++ ){
        if( i === start ){
          out += substitute;
          i = end - 1;
          continue;
        }
        ch = str[i];
        out += ch;
      }
      return out;
    },

    String_replaceAll : function( str, substringToReplace, substitute ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      if( typeof substringToReplace !== "string" ){
        throw "arg at index 1 must be a string"
      }
      if( typeof substitute !== "string" ){
        throw "arg at index 1 must be a string"
      }
      var i, ch, j, out="";
      outer : for( i=0; i<str.length; i++ ){
        ch = str[i];
        if( ch === substringToReplace[0] ){
          for( j=0; j<substringToReplace.length; j++ ){
            if( str[i+j] !== substringToReplace[j] ){
              out += ch;
              continue outer;
            }
          }
          out += substitute;
          i += substringToReplace.length - 1;
          continue;
        }else{
          out += ch;
        }
      }
      return out;
    },




    /**
     * checks if the provided string, of any length,
     * when unary-coerced to a number, is a value with a
     * type number. this is for, in less abstract terms,
     * checking if the full string's intention was to spell
     * out a value that can be evaluated as a number in
     * javascript. such as the following examples:
     * 
     * "123", "-0", "9e9", "5", "-3", "", "\n "
     * "0xff", "0b01101", "Infinity", "NaN",
     * 
     * but NOT the following:
     * 
     * "abc", "foo", "function(){}", "1n", "infinity"
     * 
     * note this does not work for BigInts.
     * 
     */
    canBeNum : function( str ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      if( str === "NaN" ){
        return true;
      }
      var n = +str;
      return esx.typechk.isNumber( n ) && !esx.typechk.isNaNNumber( n );
    },

    /**
     * sees if a string can start with a "canBeNum" substring.
     * if it does, returns the longest possible "canBeNum"
     * substring it starts with before hitting a character
     * that makes it invalid. otherwise, returns false. this
     * is useful (or rather, canEndWithNum is in this case)
     * for getting the lineNo and colNo off the end of error
     * stack lines when RegExp is not available. a few months
     * ago i encountered weird behavior in firefox or safari
     * where the stack trace was giving me negative numbers
     * for the computed lines/columns, which made me want to
     * write a method that can accomodate for these edge
     * cases. so this should be able to match a line/column
     * if for whatever reason the error stack bizarrely says
     * they are negative, NaN, floats, etc
     */
    canStartWithNum : function( str ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      var i, acc="", results=[];
      for( i=0; i<str.length; i++ ){
        if( acc.length && this.canBeNum(acc) ){
          results[ results.length ] = acc;
        }
        acc += str[i];
      }
      return results[ results.length - 1 ] || false;
    },

    canEndWithNum : function( str ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      var i, acc="", results=[];
      for( i=str.length-1; i>=0; i-- ){
        if( acc.length && etc.canBeNum(acc) ){
          results[ results.length ] = acc;
        }
        acc = str[i] + acc;
      }
      return results[ results.length - 1 ] || false;
    },

    
    getRandomLowercaseId : function(){
      return this.String_slice( Math.random().toString(36), 2 );
    },

    getRandomId : function(){
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var i, ch, out="";
      for( i=0; i<8; i++ ){
        ch = esx.arr.getRandomItem( chars );
        out += ch;
      }
      return out;
    },

    getRandomURLParam : function(){
      return this.getRandomId() + "=" + this.getRandomId();
    },




    /**
     * these methods arent necessary as they are in the
     * ES1 spec but i'm including them in here just in
     * case, under doNotUse
     **/
    doNotUse : {

      String_prototype_fromCharCode : function( code ){
        if( !esx.typechk.isIntegerNumber(code) ){
          throw "arg at index 0 must be an integer"
        }
        var codesAndChars = esx.chcodes.getCodesAndChars();
        if( code > 0xffff ){
          throw "invalid character code was provided. must be between 0 and 0xffff, inclusive.";
        }
        return codesAndChars[ code ];
      },

      String_charCodeAt : function( str, i ){
        if( typeof str !== "string" ){
          throw "arg at index 0 must be a string"
        }
        if( !esx.typechk.isIntegerNumber( i ) ){
          throw "arg at index 1 must be an integer"
        }
        var charsAndCodes = esx.chcodes.getCharsAndCodes();
        var ch = str[i];
        if( typeof ch === "undefined" ){
          throw "character at index " + i + " was undefined"
        }
        if( ch in charsAndCodes ){
          return charsAndCodes[ str[i] ];
        }else{
          throw "provided character exceeded 0-0xffff character range; code point unknown."
        }
      }

    }

  };

  esx.str = out;

}()
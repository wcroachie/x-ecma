void function(){

  "use strict";

  /**
   * @requires str
   * @requires typechk
   * @requires utf8
   */

  function encode( utf8Bytes, excludeCodes ){
    if( !esx.typechk.isObject(utf8Bytes) || !esx.typechk.isLengthy(utf8Bytes) ){
      throw "arg at index 0 must be a lengthy object"
    }
    if( !esx.typechk.isObject(excludeCodes) || !esx.typechk.isLengthy(excludeCodes) ){
      throw "arg at index 1 must be a lengthy object"
    }
    var uri = "";
    var i, code, j, excludeCode, encodedByte;
    outer : for( i=0; i<utf8Bytes.length; i++ ){
      code = utf8Bytes[i];
      for( j=0; j<excludeCodes.length; j++ ){
        excludeCode = excludeCodes[j];
        if( code === excludeCode ){
          uri += String.fromCharCode( code );
          continue outer;
        }
      }
      encodedByte = code.toString(16).toUpperCase();
      while( encodedByte.length < 2 ){
        encodedByte = "0" + encodedByte;
      }
      uri += "%" + encodedByte;
    }
    return uri;
  }


  function decode( uri, excludeCodes ){
    if( typeof uri !== "string" ){
      throw "arg at index 0 must be a string"
    }
    if( !esx.typechk.isObject(excludeCodes) || !esx.typechk.isLengthy(excludeCodes) ){
      throw "arg at index 1 must be a lengthy object"
    }
    var validHexChars = "0123456789abcdef";
    var str = "";
    var i, ch, code, j, excludeCode, out;
    outer : for( i=0; i<uri.length; i++ ){
      ch = uri[i];
      if( ch === "%" ){
        if(
          validHexChars.indexOf(uri[i+1].toLowerCase()) > -1 &&
          validHexChars.indexOf(uri[i+2].toLowerCase()) > -1
        ){
          code = parseInt( uri[i+1] + uri[i+2], 16 );
          for( j=0; j<excludeCodes.length; j++ ){
            excludeCode = excludeCodes[j];
            if( code === excludeCode ){
              str += ch;
              continue outer;
            }
          }
          out = String.fromCharCode( code );
          str += out;
          i += 2;
        }else{
          str += ch;
        }
      }else{
        str += ch;
      }
    }
    return str;
  }


  var out = {

    escape : function( str ){

      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
  
      /**
       * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/escape
       * 
       * The escape() function replaces all characters with escape sequences,
       * with the exception of ASCII word characters (A–Z, a–z, 0–9, _) and @\*_+-./.
       * 
       * Characters are escaped by UTF-16 code units. If the code unit's value is
       * less than 256, it is represented by a two-digit hexadecimal number in the
       * format %XX, left-padded with 0 if necessary. Otherwise, it is represented
       * by a four-digit hexadecimal number in the format %uXXXX, left-padded with
       * 0 if necessary.
       */
  
      str += "";
  
      var doNotEncode = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.@\\*/+";
      var esc = "";
      var i, ch, code, out;
  
      for( i=0; i<str.length; i++ ){
        ch = str[i];
        if( doNotEncode.indexOf( ch ) > -1 ){
          esc += ch;
          continue;
        }
        code = ch.charCodeAt();
        out = code.toString(16).toUpperCase();
        if( code < 256 ){
          out = esx.str.String_padStart( out, 2, "0" );
          out = "%" + out;
        }else{
          out = esx.str.String_padStart( out, 4, "0" );
          out = "%u" + out;
        }
        esc += out;
      }
  
      return esc;

    },

    unescape : function( esc ){

      if( typeof esc !== "string" ){
        throw "arg at index 0 must be a string"
      }

      var str = "";
      var validHexChars = "0123456789abcdef";
      var i, ch, slice, code, out;
      for( i=0; i<esc.length; i++ ){
        ch = esc[i];
        if( ch === "%" ){
          if( esc[i+1] === "u" ){
            slice = esx.str.String_slice( esc, i+2, i+6 ).toLowerCase();
            if(
              validHexChars.indexOf(slice[0]) > -1 &&
              validHexChars.indexOf(slice[1]) > -1 &&
              validHexChars.indexOf(slice[2]) > -1 &&
              validHexChars.indexOf(slice[3]) > -1
            ){
              code = parseInt( slice, 16 );
              out = String.fromCharCode( code );
              str += out;
              i += 5;
              continue;
            }else{
              str += ch;
              continue; 
            }
          }else{
            slice = esx.str.String_slice( esc, i+1, i+3 ).toLowerCase();
            if(
              validHexChars.indexOf(slice[0]) > -1 &&
              validHexChars.indexOf(slice[1]) > -1
            ){
              code = parseInt( slice, 16 );
              out = String.fromCharCode( code );
              str += out;
              i += 2;
              continue;
            }else{
              str += ch;
              continue;
            }
          }
        }else{
          str += ch;
        }
        
      }

      return str;

    },


    encodeURI : function( str ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      var utf8Bytes = esx.utf8.str2utf8( str );
      var excludeCodes = esx.utf8.str2utf8("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'();/?:@&=+$,#");
      return encode( utf8Bytes, excludeCodes );
    },

    decodeURI : function( uri ){
      if( typeof uri !== "string" ){
        throw "arg at index 0 must be a string"
      }
      var excludeCodes = esx.utf8.str2utf8("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'();/?:@&=+$,#");
      return decode( uri, excludeCodes );
    },

    encodeURIComponent : function( str ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }
      var utf8Bytes = esx.utf8.str2utf8( str );
      var excludeCodes = esx.utf8.str2utf8("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'()");
      return encode( utf8Bytes, excludeCodes );
    },

    decodeURIComponent : function( uriComp ){
      if( typeof uriComp !== "string" ){
        throw "arg at index 0 must be a string"
      }
      var excludeCodes = esx.utf8.str2utf8("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.!~*'()");
      return decode( uriComp, excludeCodes );
    }

  };

  var key;
  for( key in out ){
    esx[key] = out[key];
  }

}()
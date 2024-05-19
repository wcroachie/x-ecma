void function(){

  "use strict";

  /**
   * @requires arr
   * @requires typechk
   */

  /**
   * 
   * JEBP - javascipt embedded binary protocol
   * 
   * requesting media on the internet can be difficult due
   * to CORS restrictions. however, both javascript and css
   * files are the exception since they are always read as
   * plaintext and can be requested/ran cross-origin. think
   * of this protocol like JSONP except when the place you're
   * hosting your files on cannot be configured for that. or,
   * perhaps this is a better alternative to data URLs, which
   * take up more space than the original files.
   * 
   * this safely embeds any binary data into a javascript file,
   * by creating a binary string from it and hiding it inside
   * of a multiline comment. any false comment escapes within
   * the input at recorded and replaced with "XX", and then
   * put in a list. the binary data is "unpacked" at runtime.
   * as soon as the script is loaded, it adds the bytes
   * to whatever the "this" property is in the env it was
   * loaded in, using the format "jebp://[unix time in ms]".
   * 
   * note - it uses Uint8Array if available but otherwise uses
   * an array
   * 
   */

  function getFalseCommentExitIndices( byteArr ){
    var falseCommentExitIndices = [];
    var asteriskCode = "*".charCodeAt();
    var fwSlashCode = "/".charCodeAt();
    var i, byte, nextByte;
    for( i=0; i<byteArr.length-1; i++ ){
      byte = byteArr[i];
      nextByte = byteArr[i+1];
      if( (byte === asteriskCode) && (nextByte === fwSlashCode) ){
        falseCommentExitIndices.push( i );
      }
    }
    return falseCommentExitIndices;
  }

  /**
   * instead of simply removing the asterisk and forward
   * slash we have to replace it with a placeholder character
   * because if you have something like asterisk-asterisk-fwslash-fwslash
   * when truncated it will still be a comment closing tag
   */
  function removeFalseCommentExits( byteArr ){
    var falseCommentExitIndices = getFalseCommentExitIndices( byteArr );
    var out = [];
    var i, byte;
    for( i=0; i<byteArr.length; i++ ){
      if( falseCommentExitIndices.indexOf(i) !== -1 ){
        out.push( "X".charCodeAt() );
        out.push( "X".charCodeAt() );
        i += 1;
      }else{
        byte = byteArr[i];
        out.push( byte );
      }
    }
    return [falseCommentExitIndices, out ];
  }

  function makeFrom( bytesOrStr, outputAsStringInsteadOfUi8 ){
    var bytes = [];
    if( typeof bytesOrStr === "string" ){
      var i;
      for( i=0; i<bytesOrStr.length; i++ ){
        bytes[ bytes.length ] = bytesOrStr.charCodeAt( i );
      }
    }else{
      if( !esx.typechk.isLengthy(bytesOrStr) ){
        throw "if not a string, bytesOrStr must be lengthy"
      }
      bytes = bytesOrStr;
    }
    var fixed = removeFalseCommentExits( bytes );
    var indicesString = esx.arr.Array_join( fixed[0], "," );
    var chars = esx.arr.Array_map( fixed[1], function(e,n,a){
      return String.fromCharCode(e);
    });
    var binaryString = esx.arr.Array_join( chars, "" );
    var result = ""
      + "!function(){"
      +   "var start = Date.now();"
      +   "for( ;; ){"
      +     "if( Date.now() > start ){"
      +       "break;"
      +     "}"
      +   "}"
      +   "var id = Date.now();"
      +   "this['jebp://'+id] = function(){"
      +     "function f(){"
      +       "return [" + indicesString + "]/*"+ binaryString + "*/"
      +     "}"
      +     "var indices=f();"
      +     "var i, bin="+(outputAsStringInsteadOfUi8 ? "''" : "[]")+", s=f+'', opened, i2=0;"
      +     "for( i=13; i<s.length-3; i++ ){"
      +       "if( !opened ){"
      +         "if( s[i] === '*' && s[i-1] === '/' ){"
      +           "opened = true;"
      +         "}"
      +       "}else{"
      +         "if( indices.indexOf( i2 ) !== -1 ){"
      +           (outputAsStringInsteadOfUi8 ? "bin += '*';" : "bin[ bin.length ] = ('*').charCodeAt(0);")
      +           (outputAsStringInsteadOfUi8 ? "bin += '/';" : "bin[ bin.length ] = ('/').charCodeAt(0);")
      +           "i++;"
      +           "i2++;"
      +         "}else{"
      +           (outputAsStringInsteadOfUi8 ? "bin += s[i];" : "bin[ bin.length ] = s[i].charCodeAt(0);")
      +         "}"
      +         "i2 ++;"
      +       "}"
      +     "}"
      +     ( outputAsStringInsteadOfUi8 ? "" : "if( typeof Uint8Array !== 'undefined' ){ return new Uint8Array( bin ) }" )
      +     "return bin;"
      +   "}();"
      + "}()"
    ;
    var out = [];
    var i;
    for( i=0; i<result.length; i++ ){
      out[out.length] = result.charCodeAt(i);
    }
    return out;
  }

  var out = {

    /* convert an array of bytes to an array of jebp bytes */
    makeJeb : function( bytesOrStr, outputAsStringInsteadOfUi8 ){
      return makeFrom( bytesOrStr, outputAsStringInsteadOfUi8 );
    }

  };

  esx.jeb = out;

}()
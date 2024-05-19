void function(){

  "use strict";

  /**
   * @requires str
   */

  /* adapted from this -  https://base64.guru/developers/javascript/examples/polyfill */
  
  var ascii = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  var out = {
    btoa : function( str ){
      if( typeof str !== "string" ){
        throw "arg at index 0 must be a string"
      }

      var len = str.length - 1;
      var i = -1;
      var b64 = "";
      var code;

      while( i < len ){
        code = str.charCodeAt(++i) << 16 | str.charCodeAt(++i) << 8 | str.charCodeAt(++i);
        b64 += ascii[(code >>> 18) & 63] + ascii[(code >>> 12) & 63] + ascii[(code >>> 6) & 63] + ascii[code & 63];
      }

      var pads = str.length % 3;

      if( pads > 0 ){
        b64 = esx.str.String_slice( b64, 0, pads - 3 );
        while( b64.length % 4 ){
          b64 += "=";
        }
      }

      return b64;
    },


    /**
     * @todo - this doesnt work fully, sometimes adds an extra null char at end. fix it.
     */
    atob : function( b64 ){

      if( typeof b64 !== "string" ){
        throw "arg at index 0 must be a string"
      }

      /**
       * mimic ff/chromium btoa behavior - seems to only throw
       * an error when there's padding but the wrong amount
       * of padding, otherwise seems to silently pad b64
       * strings that do not end in "=" (?)
       **/
      if( b64[b64.length-1] === "=" && b64.length % 3 !== 0 ){
        throw "invalid b64 string, possible incorrect amount of padding"
      }else{
        /* no padding */
        /* if length not divisible by 3, add padding at end to fix it */
        if( b64.length % 3 === 1 ){
          b64 += "=="
        }
        if( b64.length % 3 === 2 ){
          b64 += "="
        }
      }

      var indices = {};

      var i, ch;

      for( i=0; i<ascii.length; i++ ){
        ch = ascii[i];
        indices[ch] = i;
      }

      var pos = b64.indexOf("=");
      var padded = pos > -1;
      var len = padded ? pos : b64.length;
      var i = -1;
      var str = "";
      var code;

      while (i < len) {
        code = indices[b64[++i]] << 18 | indices[b64[++i]] << 12 | indices[b64[++i]] << 6 | indices[b64[++i]];
        if(code){
          str += String.fromCharCode((code >>> 16) & 255, (code >>> 8) & 255, code & 255);
        }
      }

      if (padded) {
        str = esx.str.String_slice( str, 0, pos - b64.length );
      }

      return str;
    }
  };

  var key;

  for( key in out ){
    esx[key] = out[key];
  }

}()
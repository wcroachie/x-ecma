void function(){

  "use strict";

  /**
   * @requires str
   * @requires esc
   */

  /**
   * for naming convention stuff:
   * 
   * in this context,
   * "filepath", "parentpath", and "filename" are compound
   * words. in other words, if part of a variable or function
   * name, only capitalize the first letter - i.e.Parentpath,
   * not ParentPath. This is just for naming consistency
   * 
   * 
   */

  var out = {

    params2Obj : function( paramStr ){
      if( typeof paramStr !== "string" ){
        throw "paramStr must be a string"
      }
      if( paramStr[0] === "?" ){
        paramStr = esx.str.String_slice( paramStr, 1 );
      }
      paramStr = esx.str.String_replaceAll( paramStr, "+", "%20" );
      var pieces = esx.str.String_split( paramStr, "&" );
      var obj = {};
      var i, piece, key, value;
      for( i=0; i<pieces.length; i++ ){
        piece = pieces[i];
        key = esx.str.String_split( piece, "=" )[0];
        value = esx.str.String_slice( piece, key.length + 1);
        obj[key] = esx.decodeURIComponent( value );
      }
      return obj;
    },

    obj2Params : function( obj ){
      if( obj === null || typeof obj !== "object" ){
        throw "obj must be an object"
      }
      var params = "";
      var key, encodedKey, encodedValue, encodedKeyWithPlusSpaces, encodedValueWithPlusSpaces;
      for( key in obj ){
        encodedKey = esx.encodeURIComponent(key);
        encodedValue = esx.encodeURIComponent(obj[key]);
        encodedKeyWithPlusSpaces = esx.str.String_replaceAll( encodedKey, "%20", "+" );
        encodedValueWithPlusSpaces = esx.str.String_replaceAll( encodedValue, "%20", "+" );
        params += "&" + encodedKeyWithPlusSpaces + "=" + encodedValueWithPlusSpaces;
      }
      params = esx.str.String_slice( params, 1 );
      return params;
    },

    getScheme : function( url ){
      if( typeof url !== "string" ){
        throw "url must be a string"
      }
      if( url.indexOf(":") === -1 ){
        throw "invalid url";
      }
      var scheme = esx.str.String_split( url, ":" )[0];
      if( scheme === "" ){
        throw "invalid url";
      }
      scheme = scheme.toLowerCase();
      var tokensToMatch;  
  
      /* match first char of scheme */
      tokensToMatch = "abcdefghijklmnopqrstuvwxyz";
      if( tokensToMatch.indexOf( scheme[0] ) === -1 ){
        throw "invalid url"
      }
      /* match rest of scheme */
      tokensToMatch += "0123456789+.-";
      var i, ch;
      for( i=1; i<scheme.length; i++ ){
        ch = scheme[i];
        if( tokensToMatch.indexOf(ch) === -1 ){
          throw "invalid url"
        }
      }
      return scheme + ":";
    },

    getHash : function( url ){
      if( typeof url !== "string" ){
        throw "url must be a string"
      }
      if( url.indexOf("#") > -1 ){
        var beforeHash = esx.str.String_split(url,"#")[0];
        return esx.str.String_slice( url, beforeHash.length );
      }else{
        return null;
      }
    },

    getSearch : function( url ){
      if( typeof url !== "string" ){
        throw "url must be a string"
      }
      if( url.indexOf("#") > -1 ){
        url = esx.str.String_split(url,"#")[0];
      }
      if( url.indexOf("?") > -1 ){
        var beforeQuestionMark = esx.str.String_split( url, "?" )[0];
        return esx.str.String_slice( url, beforeQuestionMark.length );
      }else{
        return null;
      }
    },

    getDomain : function( url ){
      if( typeof url !== "string" ){
        throw "url must be a string"
      }
      var scheme = this.getScheme( url );
      url = esx.str.String_slice( url, scheme.length );
      if( url.indexOf("//") !== 0 ){
        throw "invalid url"
      }
      url = esx.str.String_slice( url, 2 );
      if( url.indexOf("/") > -1 ){
        url = esx.str.String_split( url, "/" )[0];
      }
      return url;
    },

    getPath : function( url ){
      
      if( typeof url !== "string" ){
        throw "url must be a string"
      }

      var hash = this.getHash( url );
      if( hash ){
        url = esx.str.String_slice( url, 0,-hash.length);
      }

      var search = this.getSearch( url );
      if( search ){
        url = esx.str.String_slice( url, 0, -search.length );
      }

      var scheme = this.getScheme( url );
      url = esx.str.String_slice( url, scheme.length );
      
      if( url.indexOf("//") !== 0 ){
        throw "invalid url"
      }
      url = this.slice( url, 2 );

      if( url.indexOf("/") > -1 ){
        var beforeFirstSlash = esx.str.String_split( url, "/" )[0];
        url = esx.str.String_slice( url, beforeFirstSlash.length );
        return url;
      }else{
        return "";
      }

    },

    getFilename : function( urlOrPath ){

      if( typeof urlOrPath !== "string" ){
        throw "urlOrPath must be a string"
      }

      var hash = this.getHash( urlOrPath );
      if( hash ){
        urlOrPath = esx.str.String_slice( urlOrPath, 0,-hash.length);
      }

      var search = this.getSearch( urlOrPath );
      if( search ){
        urlOrPath = esx.str.String_slice( urlOrPath, 0, -search.length );
      }

      var betweenSlashes = esx.str.String_split( urlOrPath, "/" );
      var afterLastSlash = betweenSlashes[ betweenSlashes.length - 1 ];

      return afterLastSlash;

    },

    /**
     * note - if the provided path ends with
     * a "/" it will return the same path
     */
    getParentpath : function( urlOrPath ){

      if( typeof urlOrPath !== "string" ){
        throw "urlOrPath must be a string"
      }

      if( path[path.length - 1] === "/" ){
        return path;
      }

      var filename = this.getFilename( path );
      var beforeFilename = esx.str.String_slice( path, 0, -filename.length );
      return beforeFilename;

    },

    getFilenameExt : function( filename ){
      if( typeof filename !== "string" ){
        throw "filename must be a string"
      }
      var betweenPeriods = esx.str.String_split( filename, "." );
      return betweenPeriods[ betweenPeriods.length - 1 ];
    },

    getFilenameName : function( filename ){
      if( typeof filename !== "string" ){
        throw "filename must be a string"
      }
      var ext = this.getFilenameExt( filename );
      return esx.str.String_slice( filename, -ext.length - 1 );
    },

    getLocalParentPath : function(){

      var parentUri;

      if( typeof document === "object" ){
        parentUri = function(){
          var a = document.createElement("a");
          a.href = "x";
          return esx.str.String_slice(a.href,0,-1);
        }();
      }else{
        var href = location.href;
        var scheme = this.getScheme( href );
        var domain = this.getDomain( href );
        var path = this.getPath( href );
        var parentpath = this.getParentpath( path );
        parentUri = scheme + "//" + domain + parentpath;
      }

      return parentUri;

    },

  };

  esx.url = out;

}()
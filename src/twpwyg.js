class TWPWYG {
  constructor() {

  }

  static insertTagWithText( link, tagName ) {
    let startTag = "<" + tagName + ">";
    let endTag = "</" + tagName + ">";
    this.insertTag( link, startTag, endTag );

    return false;
  }

  static insertImage( link ) {
    let src = prompt( "Введите src картинки", "http://" );
    if ( src ) {
      this.insertTag( link, '<img src="' + src + '" alt="image"/>', "" )
    }

    return false;
  }

  static uploadImage( link ) {
    habrastorage_upload( null, function ( url ) {
      this.insertTag( link, '<img src="' + url + '" alt="image"/>', "" )
    }, function ( error ) {
      showFlashMessage( error, "error" )
    } );

    return false;
  }

  static insertLink( link ) {
    let href = prompt( "Введите URL ссылки", "http://" );
    if ( href ) {
      this.insertTag( link, '<a href="' + href + '">', "</a>" )
    }

    return false;
  }

  static insertUser( link ) {
    let login = prompt( "Введите никнейм пользователя", "" );
    if ( login ) {
      this.insertTag( link, '<hh user="' + login + '"/>', "" )
    }

    return false;
  }

  static insertHabracut( link ) {
    this.insertTag( link, "<habracut />", "" );

    return false;
  }

  static insertTag( link, startTag, endTag, repObj ) {
    let textareaParent = $( link )
      .parent( "form" );
    let textarea = $( "textarea", textareaParent )
      .get( 0 );
    textarea.focus();
    let scrtop = textarea.scrollTop;
    let cursorPos = this.getCursor( textarea );
    let txt_pre = textarea.value.substring( 0, cursorPos.start );
    let txt_sel = textarea.value.substring( cursorPos.start, cursorPos.end );
    let txt_aft = textarea.value.substring( cursorPos.end );
    if ( repObj ) {
      txt_sel = txt_sel.replace( /\r/g, "" );
      txt_sel = txt_sel != "" ? txt_sel : " ";
      txt_sel = txt_sel.replace( new RegExp( repObj.findStr, "gm" ), repObj.repStr )
    }
    if ( cursorPos.start == cursorPos.end ) {
      let nuCursorPos = cursorPos.start + startTag.length
    } else {
      let nuCursorPos = String( txt_pre + startTag + txt_sel + endTag )
        .length
    }
    textarea.value = txt_pre + startTag + txt_sel + endTag + txt_aft;
    this.setCursor( textarea, nuCursorPos, nuCursorPos );
    if ( scrtop ) {
      textarea.scrollTop = scrtop;
    }

    return false;
  }

  static insertTagFromDropBox( link ) {
    this.insertTagWithText( link, link.value );
    link.selectedIndex = 0;
  }

  static insertList( link, tagName ) {
    let startTag = "<" + tagName + ">\n";
    let endTag = "\n</" + tagName + ">";
    let repObj = {
      findStr: "^(.+)",
      repStr: "   <li>$1</li>"
    };
    this.insertTag( link, startTag, endTag, repObj );
    link.selectedIndex = 0;

    return false;
  }

  static insertSpoiler( link ) {
    let startTag = '<spoiler title="">';
    let endTag = "</spoiler>";
    this.insertTag( link, startTag, endTag );

    return false;
  }

  static insertMention( link ) {
    let startTag = "@";
    let endTag = "";
    this.insertTag( link, startTag, endTag );

    return false;
  }

  static insertAbbr( link ) {
    let startTag = '<abbr title="">';
    let endTag = "</abbr>";
    this.insertTag( link, startTag, endTag );

    return false;
  }

  static insertSource( link, tagName ) {
    let startTag = '<code lang="' + tagName + '">\n';
    let endTag = "\n</code>";
    this.insertTag( link, startTag, endTag );

    return false;
  }

  static insertTab( e, textarea ) {
    if ( !e ) {
      e = window.event;
    }

    if ( e.keyCode ) {
      let keyCode = e.keyCode;
    } else if ( e.which ) {
      let keyCode = e.which;
    }

    switch ( e.type ) {
    case "keydown":
      if ( keyCode == 16 ) {
        this.shift = true
      }
      break;
    case "keyup":
      if ( keyCode == 16 ) {
        this.shift = false
      }
      break
    }
    textarea.focus();
    let cursorPos = this.getCursor( textarea );
    if ( cursorPos.start == cursorPos.end ) {
      return true
    } else if ( keyCode == 9 && !this.shift ) {
      let repObj = {
        findStr: "^(.+)",
        repStr: "   $1"
      };
      this.insertTag( textarea, "", "", repObj );

      return false;
    } else if ( keyCode == 9 && this.shift ) {
      let repObj = {
        findStr: "^ (.+)",
        repStr: "$1"
      };
      this.insertTag( textarea, "", "", repObj );

      return false;
    }
  }

  static getCursor( input ) {
    let result = {
      start: 0,
      end: 0
    };
    if ( input.setSelectionRange ) {
      result.start = input.selectionStart;
      result.end = input.selectionEnd
    } else if ( !document.selection ) {

      return false;
    } else if ( document.selection && document.selection.createRange ) {
      let range = document.selection.createRange();
      let stored_range = range.duplicate();
      stored_range.moveToElementText( input );
      stored_range.setEndPoint( "EndToEnd", range );
      result.start = stored_range.text.length - range.text.length;
      result.end = result.start + range.text.length
    }
    return result;
  }

  static setCursor( textarea, start, end ) {
    if ( textarea.createTextRange ) {
      let range = textarea.createTextRange();
      range.move( "character", start );
      range.select()
    } else if ( textarea.selectionStart ) {
      textarea.setSelectionRange( start, end )
    }
  }
};

module.exports = TWPWYG;
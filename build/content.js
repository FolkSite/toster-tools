(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


window.TWPWYG = require( './twpwyg' )
    .TWPWYG;

window.onload = function () {
    ( function () {

        const content = "<div class=\"wysiwyg\" data-hs_host=\"https://habrastorage.org\" role=\"wysiwyg_editor\">\n  <ul class=\"icons-bar icons-bar_horizontal\">\n    <li class=\"icons-bar__item\">\n      <a class=\"icons-bar__item_control\" role=\"wysiwyg_bold\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertTagWithText(this, 'b');\" tabindex=\"-1\" title=\"Жирный\">\n        <svg class=\"icon_svg icon_editor_bold\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_bold\"></use>\n        </svg>\n      </a>\n    </li>\n    <li class=\"icons-bar__item\">\n      <a class=\"icons-bar__item_control\" role=\"wysiwyg_italic\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertTagWithText(this, 'i');\" tabindex=\"-1\" title=\"Курсив\">\n        <svg class=\"icon_svg icon_editor_italic\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_italic\"></use>\n        </svg>\n      </a>\n    </li>\n    <li class=\"icons-bar__item dropdown\" role=\"dropdown\">\n      <span class=\"icons-bar__item_control\" data-toggle=\"dropdown\" tabindex=\"-1\" title=\"Вставить список\" role=\"dropdown_trigger\">\n        <svg class=\"icon_svg icon_editor_list\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_list\"></use>\n        </svg>\n      </span>\n      <div class=\"dropdown__menu\">\n        <ul class=\"menu menu_dropdown\">\n          <li class=\"menu__item\">\n            <a class=\"icon_link-internet menu__item-link\" role=\"wysiwyg_list_num\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertList(this, 'ol');\">Нумерованный список</a>\n          </li>\n          <li class=\"menu__item\">\n            <a class=\"icon_comp menu__item-link\" role=\"wysiwyg_list\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertList(this, 'ul');\">Ненумерованный список</a>\n          </li>\n        </ul>\n      </div>\n    </li>\n    <li class=\"icons-bar__item dropdown\" role=\"dropdown\">\n      <span class=\"icons-bar__item_control\" data-toggle=\"dropdown\" tabindex=\"-1\" title=\"Вставить изображение\" role=\"dropdown_trigger\">\n        <svg class=\"icon_svg icon_editor_picture\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_picture\"></use>\n        </svg>\n      </span>\n      <div class=\"dropdown__menu\">\n        <ul class=\"menu menu_dropdown\">\n          <li class=\"menu__item\">\n            <a class=\"icon_link-internet menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertImage(this);\">Из интернета</a>\n          </li>\n          <li class=\"menu__item\">\n            <a class=\"icon_comp menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.uploadImage(this);\">С компьютера</a>\n          </li>\n        </ul>\n      </div>\n    </li>\n    <li class=\"icons-bar__item\">\n      <a class=\"icons-bar__item_control\" role=\"wysiwyg_link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertLink(this);\" tabindex=\"-1\" title=\"Вставить ссылку\">\n        <svg class=\"icon_svg icon_editor_link\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_link\"></use>\n        </svg>\n      </a>\n    </li>\n    <li class=\"icons-bar__item\">\n      <a class=\"icons-bar__item_control\" role=\"wysiwyg_quote\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertTagWithText(this, 'blockquote');\" tabindex=\"-1\" title=\"Вставить цитату\">\n        <svg class=\"icon_svg icon_editor_quote\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_quote\"></use>\n        </svg>\n      </a>\n    </li>\n    <li class=\"icons-bar__item dropdown\" role=\"dropdown\">\n      <span class=\"icons-bar__item_control\" data-toggle=\"dropdown\" tabindex=\"-1\" title=\"Вставить исходный код\" role=\"dropdown_trigger\">\n        <svg class=\"icon_svg icon_dots\" viewBox=\"0 0 131 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_dots\"></use>\n        </svg>\n      </span>\n      <div class=\"dropdown__menu\">\n  <ul class=\"menu menu_dropdown menu_scroll\">\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertTagWithText(this, 'code');\">\n        Code\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'javascript');\">\n        JavaScript\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'html');\">\n        HTML\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'php');\">\n        PHP\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'ruby');\">\n        Ruby\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'java');\">\n        Java\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'perl');\">\n        Perl\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'python');\">\n        Python\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'bash');\">\n        Bash\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'cs');\">\n        C#\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'cpp');\">\n        C++\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'css');\">\n        CSS\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'diff');\">\n        Diff\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'xml');\">\n        XML\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'sql');\">\n        SQL\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, '1c');\">\n        1C\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'actionscript');\">\n        ActionScript\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'apache');\">\n        Apache\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'axapta');\">\n        Axapta\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'cmake');\">\n        CMake\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'coffeescript');\">\n        CoffeeScript\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'dos');\">\n        DOS\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'delphi');\">\n        Delphi\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'django');\">\n        Django\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'erlang');\">\n        Erlang\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'erlang_repl');\">\n        Erlang REPL\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'go');\">\n        Go\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'haskell');\">\n        Haskell\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'lisp');\">\n        Lisp\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'lua');\">\n        Lua\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'mel');\">\n        MEL\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'markdown');\">\n        Markdown\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'matlab');\">\n        Matlab\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'nginx');\">\n        Nginx\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'objectivec');\">\n        Objective C\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'rust');\">\n        Rust\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'scala');\">\n        Scala\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'smalltalk');\">\n        Smalltalk\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'tex');\">\n        TeX\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'vbscript');\">\n        VBScript\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'vhdl');\">\n        VHDL\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return TWPWYG.insertSource(this, 'vala');\">\n        Vala\n      </a>\n    </li>\n  </ul>\n</div>\n    </li>\n  </ul>\n</div>";

        const commentForms = document.querySelectorAll( 'form.form_comments[role$="comment_form"]' );

        for ( let i = 0; i < commentForms.length; i++ ) {
            let form = commentForms[ i ];
            let field_wrap = form.querySelector( 'div.field_wrap' );

            let div = document.createElement( 'div' );
            div.innerHTML = content;
            field_wrap.insertBefore( div, field_wrap.firstChild );
        }

    } )();
};
},{"./twpwyg":2}],2:[function(require,module,exports){
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

module.exports.TWPWYG = TWPWYG;
},{}]},{},[1]);

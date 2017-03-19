(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


const commentForms = document.querySelectorAll( 'form.form_comments[role$="comment_form"]' );

if ( !!commentForms ) {

    let script = document.createElement( 'script' );
    script.innerHTML = "$( 'textarea.textarea' ).keydown( function ( e ) {\n    let textareaParent = $( this ).parents( \"form\" );\n    let button = $( 'button[type=\"submit\"]', textareaParent ).get( 0 );\n    if ( ( e.ctrlKey || e.metaKey ) && ( e.keyCode == 13 || e.keyCode == 10 ) ) {\n        button.click();\n    }\n} );\n\nwindow.TWPWYG = {};\n\n\nwindow.TWPWYG.getCursor = function ( input ) {\n    let result = {\n        start: 0,\n        end: 0\n    };\n    if ( input.setSelectionRange ) {\n        result.start = input.selectionStart;\n        result.end = input.selectionEnd\n    } else if ( !document.selection ) {\n        return false;\n    } else if ( document.selection && document.selection.createRange ) {\n        let range = document.selection.createRange();\n        let stored_range = range.duplicate();\n        stored_range.moveToElementText( input );\n        stored_range.setEndPoint( \"EndToEnd\", range );\n        result.start = stored_range.text.length - range.text.length;\n        result.end = result.start + range.text.length\n    }\n    return result;\n};\n\nwindow.TWPWYG.setCursor = function ( textarea, start, end ) {\n    if ( textarea.createTextRange ) {\n        let range = textarea.createTextRange();\n        range.move( \"character\", start );\n        range.select()\n    } else if ( textarea.selectionStart ) {\n        textarea.setSelectionRange( start, end )\n    }\n};\n\nwindow.TWPWYG.insertImage = function ( link ) {\n    let src = prompt( \"Введите src картинки\", \"http://\" );\n    if ( src ) {\n        window.TWPWYG.insertTag( link, '<img src=\"' + src + '\" alt=\"image\"/>', \"\" )\n    }\n\n    return false;\n};\n\nwindow.TWPWYG.uploadImage = function ( link ) {\n    habrastorage_upload( null, function ( url ) {\n        window.TWPWYG.insertTag( link, '<img src=\"' + url + '\" alt=\"image\"/>', \"\" )\n    }, function ( error ) {\n        showFlashMessage( error, \"error\" )\n    } );\n\n    return false;\n};\n\nwindow.TWPWYG.insertLink = function ( link ) {\n    let href = prompt( \"Введите URL ссылки\", \"http://\" );\n    if ( href ) {\n        window.TWPWYG.insertTag( link, '<a href=\"' + href + '\">', \"</a>\" )\n    }\n\n    return false;\n};\n\nwindow.TWPWYG.insertUser = function ( link ) {\n    let login = prompt( \"Введите никнейм пользователя\", \"\" );\n    if ( login ) {\n        window.TWPWYG.insertTag( link, '<hh user=\"' + login + '\"/>', \"\" )\n    }\n\n    return false;\n};\n\nwindow.TWPWYG.insertHabracut = function ( link ) {\n    window.TWPWYG.insertTag( link, \"<habracut />\", \"\" );\n\n    return false;\n};\n\nwindow.TWPWYG.insertTag = function ( link, startTag, endTag, repObj ) {\n    let textareaParent = $( link ).parents( \"form\" );\n    let form_id = $( \"#\" + textareaParent.attr( \"id\" ) );\n    let textarea = $( \"textarea\", textareaParent ).get( 0 );\n    textarea.focus();\n    let scrtop = textarea.scrollTop;\n    let cursorPos = window.TWPWYG.getCursor( textarea );\n    let txt_pre = textarea.value.substring( 0, cursorPos.start );\n    let txt_sel = textarea.value.substring( cursorPos.start, cursorPos.end );\n    let txt_aft = textarea.value.substring( cursorPos.end );\n    let nuCursorPos;\n    if ( repObj ) {\n        txt_sel = txt_sel.replace( /\\r/g, \"\" );\n        txt_sel = txt_sel != \"\" ? txt_sel : \" \";\n        txt_sel = txt_sel.replace( new RegExp( repObj.findStr, \"gm\" ), repObj.repStr )\n    }\n    if ( cursorPos.start == cursorPos.end ) {\n        nuCursorPos = cursorPos.start + startTag.length\n    } else {\n        nuCursorPos = String( txt_pre + startTag + txt_sel + endTag ).length\n    }\n    textarea.value = txt_pre + startTag + txt_sel + endTag + txt_aft;\n    window.TWPWYG.setCursor( textarea, nuCursorPos, nuCursorPos );\n    if ( scrtop ) {\n        textarea.scrollTop = scrtop;\n    }\n    toggleSubmitButton( form_id );\n    return false;\n};\n\nwindow.TWPWYG.insertTagWithText = function ( link, tagName ) {\n    let startTag = \"<\" + tagName + \">\";\n    let endTag = \"</\" + tagName + \">\";\n    window.TWPWYG.insertTag( link, startTag, endTag );\n\n    return false;\n};\n\nwindow.TWPWYG.insertTagFromDropBox = function ( link ) {\n    window.TWPWYG.insertTagWithText( link, link.value );\n    link.selectedIndex = 0;\n};\n\nwindow.TWPWYG.insertList = function ( link, tagName ) {\n    let startTag = \"<\" + tagName + \">\\n\";\n    let endTag = \"\\n</\" + tagName + \">\";\n    let repObj = {\n        findStr: \"^(.+)\",\n        repStr: \"   <li>$1</li>\"\n    };\n    window.TWPWYG.insertTag( link, startTag, endTag, repObj );\n    link.selectedIndex = 0;\n\n    return false;\n};\n\nwindow.TWPWYG.insertSpoiler = function ( link ) {\n    let startTag = '<spoiler title=\"\">';\n    let endTag = \"</spoiler>\";\n    window.TWPWYG.insertTag( link, startTag, endTag );\n\n    return false;\n};\n\nwindow.TWPWYG.insertMention = function ( link ) {\n    let startTag = \"@\";\n    let endTag = \"\";\n    window.TWPWYG.insertTag( link, startTag, endTag );\n\n    return false;\n};\n\nwindow.TWPWYG.insertAbbr = function ( link ) {\n    let startTag = '<abbr title=\"\">';\n    let endTag = \"</abbr>\";\n    window.TWPWYG.insertTag( link, startTag, endTag );\n\n    return false;\n};\n\nwindow.TWPWYG.insertSource = function ( link, tagName ) {\n    let startTag = '<code lang=\"' + tagName + '\">\\n';\n    let endTag = \"\\n</code>\";\n    window.TWPWYG.insertTag( link, startTag, endTag );\n\n    return false;\n};\n\nwindow.TWPWYG.insertTab = function ( e, textarea ) {\n    if ( !e ) {\n        e = window.event;\n    }\n\n    if ( e.keyCode ) {\n        let keyCode = e.keyCode;\n    } else if ( e.which ) {\n        let keyCode = e.which;\n    }\n\n    switch ( e.type ) {\n    case \"keydown\":\n        if ( keyCode == 16 ) {\n            this.shift = true\n        }\n        break;\n    case \"keyup\":\n        if ( keyCode == 16 ) {\n            this.shift = false\n        }\n        break\n    }\n    textarea.focus();\n    let cursorPos = window.TWPWYG.getCursor( textarea );\n    if ( cursorPos.start == cursorPos.end ) {\n        return true\n    } else if ( keyCode == 9 && !this.shift ) {\n        let repObj = {\n            findStr: \"^(.+)\",\n            repStr: \"   $1\"\n        };\n        window.TWPWYG.insertTag( textarea, \"\", \"\", repObj );\n\n        return false;\n    } else if ( keyCode == 9 && this.shift ) {\n        let repObj = {\n            findStr: \"^ (.+)\",\n            repStr: \"$1\"\n        };\n        window.TWPWYG.insertTag( textarea, \"\", \"\", repObj );\n\n        return false;\n    }\n};";

    document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );

    const content = "<div class=\"wysiwyg twpwyg_bar\" data-hs_host=\"https://habrastorage.org\" role=\"wysiwyg_editor\">\n  <ul class=\"icons-bar icons-bar_horizontal\">\n    <li class=\"icons-bar__item\">\n      <a class=\"icons-bar__item_control\" role=\"wysiwyg_bold\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertTagWithText(this, 'b');\" tabindex=\"-1\" title=\"Жирный\">\n        <svg class=\"icon_svg icon_editor_bold\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_bold\"></use>\n        </svg>\n      </a>\n    </li>\n    <li class=\"icons-bar__item\">\n      <a class=\"icons-bar__item_control\" role=\"wysiwyg_italic\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertTagWithText(this, 'i');\" tabindex=\"-1\" title=\"Курсив\">\n        <svg class=\"icon_svg icon_editor_italic\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_italic\"></use>\n        </svg>\n      </a>\n    </li>\n    <li class=\"icons-bar__item dropdown\" role=\"dropdown\">\n      <span class=\"icons-bar__item_control\" data-toggle=\"dropdown\" tabindex=\"-1\" title=\"Вставить список\" role=\"dropdown_trigger\">\n        <svg class=\"icon_svg icon_editor_list\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_list\"></use>\n        </svg>\n      </span>\n      <div class=\"dropdown__menu\">\n        <ul class=\"menu menu_dropdown\">\n          <li class=\"menu__item\">\n            <a class=\"icon_link-internet menu__item-link\" role=\"wysiwyg_list_num\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertList(this, 'ol');\">Нумерованный список</a>\n          </li>\n          <li class=\"menu__item\">\n            <a class=\"icon_comp menu__item-link\" role=\"wysiwyg_list\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertList(this, 'ul');\">Ненумерованный список</a>\n          </li>\n        </ul>\n      </div>\n    </li>\n    <li class=\"icons-bar__item dropdown\" role=\"dropdown\">\n      <span class=\"icons-bar__item_control\" data-toggle=\"dropdown\" tabindex=\"-1\" title=\"Вставить изображение\" role=\"dropdown_trigger\">\n        <svg class=\"icon_svg icon_editor_picture\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_picture\"></use>\n        </svg>\n      </span>\n      <div class=\"dropdown__menu\">\n        <ul class=\"menu menu_dropdown\">\n          <li class=\"menu__item\">\n            <a class=\"icon_link-internet menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertImage(this);\">Из интернета</a>\n          </li>\n          <li class=\"menu__item\">\n            <a class=\"icon_comp menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.uploadImage(this);\">С компьютера</a>\n          </li>\n        </ul>\n      </div>\n    </li>\n    <li class=\"icons-bar__item\">\n      <a class=\"icons-bar__item_control\" role=\"wysiwyg_link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertLink(this);\" tabindex=\"-1\" title=\"Вставить ссылку\">\n        <svg class=\"icon_svg icon_editor_link\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_link\"></use>\n        </svg>\n      </a>\n    </li>\n    <li class=\"icons-bar__item\">\n      <a class=\"icons-bar__item_control\" role=\"wysiwyg_quote\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertTagWithText(this, 'blockquote');\" tabindex=\"-1\" title=\"Вставить цитату\">\n        <svg class=\"icon_svg icon_editor_quote\" viewBox=\"0 0 32 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_editor_quote\"></use>\n        </svg>\n      </a>\n    </li>\n    <li class=\"icons-bar__item dropdown\" role=\"dropdown\">\n      <span class=\"icons-bar__item_control\" data-toggle=\"dropdown\" tabindex=\"-1\" title=\"Вставить исходный код\" role=\"dropdown_trigger\">\n        <svg class=\"icon_svg icon_dots\" viewBox=\"0 0 131 32\">\n          <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" xlink:href=\"https://toster.ru/images/sprite_0.1.svg#icon_dots\"></use>\n        </svg>\n      </span>\n      <div class=\"dropdown__menu\">\n  <ul class=\"menu menu_dropdown menu_scroll\">\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertTagWithText(this, 'code');\">\n        Code\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'javascript');\">\n        JavaScript\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'html');\">\n        HTML\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'php');\">\n        PHP\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'ruby');\">\n        Ruby\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'java');\">\n        Java\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'perl');\">\n        Perl\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'python');\">\n        Python\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'bash');\">\n        Bash\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'cs');\">\n        C#\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'cpp');\">\n        C++\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'css');\">\n        CSS\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'diff');\">\n        Diff\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'xml');\">\n        XML\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'sql');\">\n        SQL\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, '1c');\">\n        1C\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'actionscript');\">\n        ActionScript\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'apache');\">\n        Apache\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'axapta');\">\n        Axapta\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'cmake');\">\n        CMake\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'coffeescript');\">\n        CoffeeScript\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'dos');\">\n        DOS\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'delphi');\">\n        Delphi\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'django');\">\n        Django\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'erlang');\">\n        Erlang\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'erlang_repl');\">\n        Erlang REPL\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'go');\">\n        Go\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'haskell');\">\n        Haskell\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'lisp');\">\n        Lisp\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'lua');\">\n        Lua\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'mel');\">\n        MEL\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'markdown');\">\n        Markdown\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'matlab');\">\n        Matlab\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'nginx');\">\n        Nginx\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'objectivec');\">\n        Objective C\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'rust');\">\n        Rust\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'scala');\">\n        Scala\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'smalltalk');\">\n        Smalltalk\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'tex');\">\n        TeX\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'vbscript');\">\n        VBScript\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'vhdl');\">\n        VHDL\n      </a>\n    </li>\n    <li class=\"menu__item\" role=\"link_static\">\n      <a class=\"menu__item-link\" href=\"javascript:void(0)\" onclick=\"return window.TWPWYG.insertSource(this, 'vala');\">\n        Vala\n      </a>\n    </li>\n  </ul>\n</div>\n    </li>\n  </ul>\n</div>";

    const createElement = ( str ) => {
        let elem = document.createElement( 'div' );
        elem.innerHTML = str;
        if ( elem.childNodes.length > 0 ) {
            return elem.childNodes[ 0 ];
        }
        return elem;
    }

    for ( let i = 0; i < commentForms.length; i++ ) {
        let form = commentForms[ i ];
        let field_wrap = form.querySelector( 'div.field_wrap' );

        let div = document.createElement( 'div' );
        div.appendChild( createElement( content ) );
        field_wrap.insertBefore( div, field_wrap.firstChild );
    }
}


var Timer = null;

var Options = {
    ajax: false,
    interval: 10,
    feed_url: "https://toster.ru/my/feed",
    tracker_url: "https://toster.ru/my/tracker"
};

const onMessageHandler = ( request, sender, callback ) => {
    if ( !!request && !!request.cmd && ( request.cmd === 'options' ) ) {
        Options = Object.assign( {}, Options, request.data );
        reStartTimer();
    }
};

const getNotifyPage = () => {
    return fetch( Options.tracker_url, {
            credentials: 'include'
        } )
        .then( function ( response ) {
            return ( response.ok === true ) ? response.text() : false;
        } )
        .catch( console.log );
};

const startTimer = () => {
    if ( !Options.ajax ) {
        return false;
    }

    if ( !!Timer ) {
        return false;
    }

    Timer = setInterval( function () {
        getNotifyPage().then( function ( _body ) {
            let $aside = document.querySelector( 'aside.layout__navbar[role="navbar"]' );
            let body = document.createElement( "div" );
            body.innerHTML = _body;
            let $event_list = body.querySelector( 'ul.events-list' );

            try {
                $aside.removeChild( $aside.querySelector( 'ul.events-list' ) );
            } catch ( e ) {}

            $aside.appendChild( $event_list );
        } );
    }, Options.interval * 1000 );
};

const stopTimer = () => {
    clearInterval( Timer );
    Timer = null;
};

const reStartTimer = () => {
    stopTimer();
    startTimer();
};


chrome.extension.onMessage.addListener( onMessageHandler );

chrome.extension.sendMessage( {
    cmd: 'options'
}, {}, onMessageHandler );
},{}]},{},[1]);
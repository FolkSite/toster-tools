/* global TWPWYG, habrastorage_upload, $, toggleSubmitButton, showFlashMessage */
/* eslint no-alert: "off" */
window.TWPWYG = {};

window.TWPWYG.getCursor = function ( input ) {
    const result = {
        start: 0,
        end: 0
    };
    if ( input.setSelectionRange ) {
        result.start = input.selectionStart;
        result.end = input.selectionEnd;
    } else if ( !document.selection ) {
        return false;
    } else if ( document.selection && document.selection.createRange ) {
        const range = document.selection.createRange();
        const stored_range = range.duplicate();
        stored_range.moveToElementText( input );
        stored_range.setEndPoint( 'EndToEnd', range );
        result.start = stored_range.text.length - range.text.length;
        result.end = result.start + range.text.length;
    }
    return result;
};

window.TWPWYG.setCursor = function ( textarea, start, end ) {
    if ( textarea.createTextRange ) {
        const range = textarea.createTextRange();
        range.move( 'character', start );
        range.select();
    } else if ( textarea.selectionStart ) {
        textarea.setSelectionRange( start, end );
    }
};

window.TWPWYG.insertImage = function ( link ) {
    const src = prompt( 'Введите src картинки', 'http://' );
    if ( src ) {
        window.TWPWYG.insertTag( link, `<img src="${src}" alt="image"/>`, '' );
    }

    return false;
};

window.TWPWYG.uploadImage = function ( link ) {
    habrastorage_upload( null, function resolver( url ) {
        window.TWPWYG.insertTag( link, `<img src="${url}" alt="image"/>`, '' );
    }, function rejecter( error ) {
        showFlashMessage( error, 'error' );
    } );

    return false;
};

window.TWPWYG.insertLink = function ( link ) {
    const href = window.prompt( 'Введите URL ссылки', 'http://' );
    if ( href ) {
        window.TWPWYG.insertTag( link, `<a href="${href}">`, '</a>' );
    }

    return false;
};

window.TWPWYG.insertUser = function ( link ) {
    const login = window.prompt( 'Введите никнейм пользователя', '' );
    if ( login ) {
        window.TWPWYG.insertTag( link, `<hh user="${login}"/>`, '' );
    }

    return false;
};

window.TWPWYG.insertHabracut = function ( link ) {
    window.TWPWYG.insertTag( link, '<habracut />', '' );

    return false;
};

window.TWPWYG.insertTag = function ( link, startTag, endTag, repObj ) {
    const textareaParent = $( link ).parents( 'form' );
    const _id = textareaParent.attr( 'id' );
    const form_id = $( `#${_id}` );
    const textarea = $( 'textarea', textareaParent ).get( 0 );
    textarea.focus();
    const scrtop = textarea.scrollTop;
    const cursorPos = window.TWPWYG.getCursor( textarea );
    const txt_pre = textarea.value.substring( 0, cursorPos.start );
    let txt_sel = textarea.value.substring( cursorPos.start, cursorPos.end );
    const txt_aft = textarea.value.substring( cursorPos.end );
    let nuCursorPos;
    if ( repObj ) {
        txt_sel = txt_sel.replace( /\r/g, '' );
        txt_sel = txt_sel !== '' ? txt_sel : ' ';
        txt_sel = txt_sel.replace( new RegExp( repObj.findStr, 'gm' ), repObj.repStr );
    }
    if ( cursorPos.start === cursorPos.end ) {
        nuCursorPos = cursorPos.start + startTag.length;
    } else {
        nuCursorPos = String( txt_pre + startTag + txt_sel + endTag ).length;
    }
    textarea.value = txt_pre + startTag + txt_sel + endTag + txt_aft;
    window.TWPWYG.setCursor( textarea, nuCursorPos, nuCursorPos );
    if ( scrtop ) {
        textarea.scrollTop = scrtop;
    }
    toggleSubmitButton( form_id );
    return false;
};

window.TWPWYG.insertTagWithText = function ( link, tagName ) {
    const startTag = `<${tagName}>`;
    const endTag = `</${tagName}>`;
    window.TWPWYG.insertTag( link, startTag, endTag );

    return false;
};

window.TWPWYG.insertTagFromDropBox = function ( link ) {
    window.TWPWYG.insertTagWithText( link, link.value );
    link.selectedIndex = 0;
};

window.TWPWYG.insertList = function ( link, tagName ) {
    const startTag = `<${tagName}>\n`;
    const endTag = `\n</${tagName}>`;
    const repObj = {
        findStr: '^(.+)',
        repStr: '   <li>$1</li>'
    };
    window.TWPWYG.insertTag( link, startTag, endTag, repObj );
    link.selectedIndex = 0;

    return false;
};

window.TWPWYG.insertSpoiler = function ( link ) {
    const startTag = '<spoiler title="Заголовок спойлера">\n';
    const endTag = '\n</spoiler>';
    window.TWPWYG.insertTag( link, startTag, endTag );

    return false;
};

window.TWPWYG.insertMention = function ( link ) {
    const startTag = '@';
    const endTag = '';
    window.TWPWYG.insertTag( link, startTag, endTag );

    return false;
};

window.TWPWYG.insertAbbr = function ( link ) {
    const startTag = '<abbr title="">';
    const endTag = '</abbr>';
    window.TWPWYG.insertTag( link, startTag, endTag );

    return false;
};

window.TWPWYG.insertSource = function ( link, tagName ) {
    const startTag = `<code lang="${tagName}">\n`;
    const endTag = '\n</code>';
    window.TWPWYG.insertTag( link, startTag, endTag );

    return false;
};

window.TWPWYG.insertTab = function ( e, textarea ) {
    let keyCode = null;
    if ( !e ) {
        e = window.event;
    }

    if ( e.keyCode ) {
        keyCode = e.keyCode;
    } else if ( e.which ) {
        keyCode = e.which;
    }

    switch ( e.type ) {
    case 'keydown':
        if ( keyCode === 16 ) {
            this.shift = true;
        }
        break;
    case 'keyup':
        if ( keyCode === 16 ) {
            this.shift = false;
        }
        break;
    default:
        break;
    }
    textarea.focus();
    const cursorPos = window.TWPWYG.getCursor( textarea );
    if ( cursorPos.start === cursorPos.end ) {
        return true;
    } else if ( keyCode === 9 && !this.shift ) {
        const repObj = {
            findStr: '^(.+)',
            repStr: '   $1'
        };
        window.TWPWYG.insertTag( textarea, '', '', repObj );

        return false;
    } else if ( keyCode === 9 && this.shift ) {
        const repObj = {
            findStr: '^ (.+)',
            repStr: '$1'
        };
        window.TWPWYG.insertTag( textarea, '', '', repObj );

        return false;
    }
};

export const createElement = ( str, parent ) => {
    const elem = ( parent || document ).createElement( 'div' );
    elem.innerHTML = str;
    if ( elem.childNodes.length > 0 ) {
        return elem.childNodes[ 0 ];
    }
    return elem;
};

export const isChrome = ( window.chrome && /chrome\//i.test( window.navigator.userAgent ) );

export const isOpera = ( ( ( window.opr && window.opr.addons ) || window.opera ) || /opr\//i.test( window.navigator.userAgent ) );

export const isFirefox = ( ( typeof InstallTrigger !== 'undefined' ) || /firefox/i.test( window.navigator.userAgent ) );

export const Device = ( () => {
    if ( typeof browser === 'undefined' ) {
        return chrome;
    }
    return browser;
} )();

export const getPage = url => fetch( url, {
    credentials: 'include'
} ).then( response => response.text() ).catch( console.error );

export const _l = ( msg, placeholders ) => {
    if ( Array.isArray( placeholders ) ) {
        return Device.i18n.getMessage( msg, placeholders );
    }
    return Device.i18n.getMessage( msg );
};

export const openWin = url => window.open( url, 'wName' );

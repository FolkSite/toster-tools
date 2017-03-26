export const $ = ( selector, parent ) => ( parent || document ).querySelector( selector );

export const $$ = ( selector, parent ) => ( parent || document ).querySelectorAll( selector );

export const createElement = ( str, parent ) => {
    const elem = ( parent || document ).createElement( 'div' );
    elem.innerHTML = str;
    if ( elem.childNodes.length > 0 ) {
        return elem.childNodes[ 0 ];
    }
    return elem;
};

export const isChrome = ( window.chrome && window.chrome.webstore );

export const isOpera = ( ( window.opr && window.opr.addons ) || window.opera || /opr\//i.test( window.navigator.userAgent ) );

export const isFirefox = ( ( typeof InstallTrigger !== 'undefined' ) || /firefox/i.test( window.navigator.userAgent ) );

export const Device = ( () => {
    if ( typeof browser === 'undefined' ) {
        return chrome;
    }
    return browser;
} )();

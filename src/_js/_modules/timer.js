/**
 * @description Extension timer module
 * @module _modules/timer
 */

import {
    Device
}
from './utils';

const checkCallback = ( callback ) => {
    if ( typeof callback === 'function' ) {
        return callback;
    }
    return c => c;
};

/**
 * Class for working with extension timers.
 * Documentation is available by reference {@link https://developer.chrome.com/extensions/alarms|chrome.alarms}
 */
class Timer {
    /**
     * Constructs the Timer class
     * @param {String} [name="Timer"] Timer name
     * @param {Number} [sec=10] Timer interval in seconds
     */
    constructor( name = 'Timer', sec = 10 ) {
        this.name = name;
        this.setInterval( sec );
    }

    /**
     * The method sets a new interval in seconds
     * @param {Number} [sec=10] Timer interval in seconds
     */
    setInterval( sec = 10 ) {
        this.intervalInSeconds = sec;
    }

    /**
     * The method returns a timestamp in seconds, taking into account the current time and the specified interval
     *
     * @returns {Number}
     */
    getWhen() {
        const when = ( Date.now() + ( this.intervalInSeconds * 1000 ) );
        return when;
    }

    /**
     * The method creates and starts a timer
     * @param {Function} [callback] Callback function
     */
    start( callback ) {
        const cb = checkCallback( callback );

        Device.alarms.create( this.name, {
            when: this.getWhen()
        } );

        cb( this.name );
    }

    /**
     * The method stops the timer
     * @param {Function} [callback] Callback function
     */
    stop( callback ) {
        const cb = checkCallback( callback );
        Device.alarms.clear( this.name, c => cb( this.name ) );
    }
}

export default Timer;

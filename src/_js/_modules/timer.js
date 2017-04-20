/**
 * @description Модуль timer
 * @module timer
 */

import {
    Device
}
from './utils';

const isFunction = ( callback ) => {
    if ( typeof callback === 'function' ) {
        return callback;
    }
    return c => c;
};

/**
 * @description  Класс для работы с таймерами расширения. Документация доступна по ссылке {@link https://developer.chrome.com/extensions/alarms|chrome.alarms}
 */
class Timer {
    /**
     * @description  Конструктор класса Timer
     * 
     * @param {String} [name="Timer"] Имя таймера
     * @param {Number} [sec=10] Интервал в секундах
     */
    constructor( name = 'Timer', sec = 10 ) {
        this.name = name;
        this.setInterval( sec );
    }

    /**
     * @description  Метод устанавливает новый интервал в секундах
     * 
     * @param {Number} [sec=10] Интервал в секундах
     */
    setInterval( sec = 10 ) {
        this.intervalInSeconds = sec;
    }

    /**
     * @description  Метод возвращает временную метку, по истечении которой таймер сгенерирует событие срабатывания
     *
     * @returns {Number}
     */
    getWhen() {
        const when = ( Date.now() + ( this.intervalInSeconds * 1000 ) );
        return when;
    }

    /**
     * @description  Метод создает и запускает таймер
     * 
     * @param {Function} [callback] Callback-функция. Вызывается после запуска таймера.
     */
    start( callback ) {
        const cb = isFunction( callback );

        Device.alarms.create( this.name, {
            when: this.getWhen()
        } );

        cb( this.name );
    }

    /**
     * @description  Метод останавливает таймер
     * 
     * @param {Function} [callback] Callback-функция. Вызывается после остановки таймера.
     */
    stop( callback ) {
        const cb = isFunction( callback );
        Device.alarms.clear( this.name, c => cb( this.name ) );
    }
}

export default Timer;

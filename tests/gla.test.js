import * as tttt from 'trythistrythat'

/**
 * Module filename - /Volumes/code/gla/tests/gla.test.js
 *
 * @param {string} id - UNIT-test
 * @returns {Promise<void> | void}
 */
export default async ( id ) => {

    tttt.describe( '# ' )
    await tttt.separator( 240, 75, '~' )
    await tttt.line()

    tttt.end_test( id )
}

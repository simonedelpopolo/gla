console.time( 'assertions finished ' )
import { EventEmitter } from 'events'
import { gla } from '../index.js'
import { ok } from 'assert/strict'
import { parse } from 'json-swiss-knife'

const AssertionEvent = new EventEmitter()

AssertionEvent.on( 'end', () => {
    console.timeEnd( 'assertions finished ' )
} )

const Assertions = {

    assertion0 : async (  ) => {
        
        console.log( '__________________________________________________________________________' )

        console.log( '\x1b[31m Assertions create and delete', 0, '\x1b[0m' )
        console.log( '    \x1b[31m create statement', 0, '\x1b[0m' )
        console.log( '    \x1b[31m delete statement', 1, '\x1b[0m' )
        
        Assertions.assertion0.statement = {
            
            '0' : ( ) => {
                console.log( '    \x1b[31m executing gla creating repository', 0, '\x1b[0m\n' )
                
                const response = gla( [ 'create', 'test', 'visibility', 'public', 'token', 'YOUR_ACCESS_TOKEN' ], true )
                
                ok( typeof response === 'object' )
                
                Assertions.assertion0.statement[ '0' ].message = 'test concluded'
                
                return response
            },
    
            '1' : ( ) => {
                console.log( '    \x1b[31m executing gla deleting repository', 1, '\x1b[0m\n' )
        
                const response = gla( [ 'delete', 'PROJECT_ID', 'token', 'YOUR_ACCESS_TOKEN' ], true )
        
                ok( typeof response === 'object' )
                
                Assertions.assertion0.statement[ '1' ].message = 'test concluded'
        
                return response
            }
            
        }
        
        console.log( '---------------------------------------------------------------------------' )
        const response0 = await Assertions.assertion0.statement[ '0' ]()
        console.log( Assertions.assertion0.statement[ '0' ].message )
        console.log( 'returned response -> ', await parse( response0 ) )

        
        console.log( '__________________________________________________________________________' )
        const response1 = await Assertions.assertion0.statement[ '1' ]()
        console.log( Assertions.assertion0.statement[ '1' ].message )
        console.log( 'returned response -> ', await parse( response1 ) )

    },
    
    assertion1 : async (  ) => {
        
        console.log( '__________________________________________________________________________' )
        
        console.log( '\x1b[31m Assertion config global token', 1, '\x1b[0m' )
        console.log( '    \x1b[31m save token', 0, '\x1b[0m' )
        console.log( '    \x1b[31m retrieve token'/*todo command to retrieve the token*/, 1, '\x1b[0m' )
        
        Assertions.assertion1.statement = {
            
            '0' : ( ) => {
                console.log( '    \x1b[31m executing gla config global', 0, '\x1b[0m\n' )
                
                const response = gla( [ 'config', 'global', 'token', 'YOUR_ACCESS_TOKEN' ], true )
                
                ok( typeof response === 'object' )
                
                Assertions.assertion1.statement[ '0' ].message = 'test concluded'
                
                return response
            },
        }
        
        console.log( '---------------------------------------------------------------------------' )
        const response0 = await Assertions.assertion1.statement[ '0' ]()
        console.log( Assertions.assertion1.statement[ '0' ].message )
        console.log( 'returned response -> ', await parse( response0 ) )
        
    },
    
    assertion2 : async (  ) => {
        
        console.log( '__________________________________________________________________________' )
        
        console.log( '\x1b[31m Assertion get all projects', 1, '\x1b[0m' )
        console.log( '    \x1b[31m get all projects', 0, '\x1b[0m' )
        
        Assertions.assertion2.statement = {
            
            '0' : ( ) => {
                console.log( '    \x1b[31m executing gla get projects', 0, '\x1b[0m\n' )
                
                const response = gla( [ 'get', 'projects', 'token', 'YOUR_ACCESS_TOKEN' ], true )
                
                console.log( response )
                ok( typeof response === 'object' )
                
                Assertions.assertion2.statement[ '0' ].message = 'test concluded'
                
                return response
            },
        }
        
        console.log( '---------------------------------------------------------------------------' )
        const response0 = await Assertions.assertion2.statement[ '0' ]()
        console.log( Assertions.assertion2.statement[ '0' ].message )
        console.log( 'returned response -> ', await parse( response0 ) )
        
    },
}

process.argv.splice( 0, 2 )

if(  process.argv.length > 0 ){

    await Assertions[ process.argv ]( 0 )
    AssertionEvent.emit( 'end' )

}else {

    for( const assertion in Assertions )
        await Assertions[ assertion ]()

    AssertionEvent.emit( 'end' )
}

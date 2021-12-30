import * as Module from 'module'
import { constants } from 'fs'
import { homedir } from 'os'
import { request } from 'https'
import { access, mkdir, readFile, writeFile } from 'fs/promises'
import { parse, property_value } from '@simonedelpopolo/json-parse'

const gla_commands__ = [
    'create',
    'delete',
    'config',
]

const gitlab_api__ = {
    
    TOKEN: null,
    
    getTOKEN: async () => {
        const accessCheck = await access( `${ homedir() }/.gla/config.json`, constants.F_OK | constants.R_OK ).catch( error => JSON.stringify( error ) )
        if ( typeof accessCheck === 'string' )
            return
        
        const config = await parse( await readFile( `${ homedir() }/.gla/config.json` ) )
        gitlab_api__.TOKEN = config.token
    },
    
    /**
     * The request to GitLab REST API.
     *
     * @param {object} options - The options for the request.
     * @param {object} data - The data to be sent.
     * @returns {Promise | PromiseFulfilledResult<string>}
     */
    req: ( options, data = null ) => {
        
        return new Promise( ( resolve ) => {
            
            const outgoing = request( options, ( incoming ) => {
                let chunks = []
                
                incoming.on( 'data', chunk => chunks.push( chunk ) )
                
                incoming.on( 'end', () => resolve( Buffer.concat( chunks ).toString() ) )
                
                incoming.on( 'error', function ( error ) {
                    process.stderr.write( error )
                    process.exit( 1 )
                } )
            } )
            
            if ( data !== null )
                outgoing.write( JSON.stringify( data ) )
            
            outgoing.end()
        } )
        
    },
    
    /**
     * GitLab REST API create project.
     *
     * @see https://docs.gitlab.com/ee/api/projects.html#create-project
     * @param { {name:string, visibility:string, token:string= } } data - Provide the name, visibility and your access token for the repository to be created.
     * @returns {Promise<string>}
     */
    create: async ( data ) => {
        
        if ( gitlab_api__.TOKEN === null )
            gitlab_api__.TOKEN = data.token
        
        const options = {
            method: 'POST',
            hostname: 'gitlab.com',
            path: '/api/v4/projects/',
            headers: {
                'Authorization': `Bearer ${ gitlab_api__.TOKEN }`,
                'Content-Type': 'application/json',
            },
        }
        
        return gitlab_api__.req( options, data )
        
    },
    
    /**
     * GitLab REST API delete project.
     *
     * @see https://docs.gitlab.com/ee/api/projects.html#delete-project
     * @param {{id:number, token:string= }} data - Provide the ID and your access token for the repository to be deleted.
     * @returns {Promise<string>}
     */
    delete: async ( data ) => {
        
        if ( gitlab_api__.TOKEN === null )
            gitlab_api__.TOKEN = data.token
        
        const options = {
            method: 'DELETE',
            hostname: 'gitlab.com',
            path: `/api/v4/projects/${ data.id }`,
            headers: {
                'Authorization': `Bearer ${ gitlab_api__.TOKEN }`,
                'Content-Type': 'application/json',
            },
        }
        
        return gitlab_api__.req( options )
        
    },
    
    /**
     * The gla global config.
     *
     * @param {{ token:string }} data - Provide your access token for your GitLab account.
     * @returns {Promise<any>}
     */
    config: async ( data ) => {
        const accessCheck = await access( `${ homedir() }/.gla`, constants.F_OK | constants.X_OK ).catch( error => JSON.stringify( error ) )
        
        if ( typeof accessCheck === 'string' ) {
            
            const homeCheck = await access( `${ homedir() }`, constants.X_OK | constants.W_OK ).catch( error => JSON.stringify( error ) )
            if ( typeof homeCheck === 'string' )
                return homeCheck
            
            await mkdir( `${ homedir() }/.gla` )
        }
        
        const saveJSON = {
            token: data.token,
        }
        
        return writeFile( `${ homedir() }/.gla/config.json`, JSON.stringify( saveJSON ) )
            .then( () => JSON.stringify( { token: 'saved' } ) )
            .catch( error => JSON.stringify( error ) )
        
    },
    
    commands: ( argv ) => {
        
        return new Promise( ( resolve, reject ) => {
            
            if ( !gla_commands__.includes( argv ) )
                reject( 'command not found' )
        } )
    },
}

const GitLabAPI = Object.create( Module )

const entryPoint = Symbol( 'entry point of the shell gitlab-API' )
Object.defineProperty( GitLabAPI, entryPoint, {
    enumerable: true,
    configurable: false,
    writable: false,
    
    /**
     * GitLab API shell.
     *
     * @param {string[]} argv - The command to pass.
     * @param {boolean} quite - This, set to true, will silence the standard output.
     * @returns {string}
     */
    value: async function entryPoint( argv, quite = false ) {
        
        gitlab_api__.commands( argv[ 0 ] ).catch( error => {
            process.stderr.write( `${ error }\n` )
            process.stderr.write( 'usage: gla create name-of-repository visibility public token YOUR_ACCESS_TOKEN\n' )
            process.stderr.write( 'usage: gla delete id-project token YOUR_ACCESS_TOKEN\n' )
            process.stderr.write( 'usage: gla config global token YOUR_ACCESS_TOKEN\n' )
            process.stderr.write( 'you must specify create, delete or config' )
            process.exit( 1 )
        } )
        
        let command
        command = await property_value( argv, true )
        
        if ( command instanceof SyntaxError ) {
            process.stderr.write( command.message )
            process.exit( 1 )
        }
        
        await gitlab_api__.getTOKEN()
        
        let response
        if ( command.create ) {
            const data = {
                name: command.create,
                visibility: command.visibility,
                token: command.token,
            }
            response = await gitlab_api__.create( data )
        }
        
        if ( command.delete ) {
            const data = {
                id: command.delete,
                token: command.token,
            }
            response = await gitlab_api__.delete( data )
        }
        
        if ( command.config ) {
            const data = {
                token: command.token,
            }
            response = await gitlab_api__.config( data )
        }
        
        if ( !quite )
            console.log( await parse( response ) )
        
        return response
    },
} )

Object.freeze( GitLabAPI )

/**
 * GitLab API shell.
 *
 * @param {string[]} argv - The command to pass.
 * @param {boolean} quite - This, set to true, will silence the standard output.
 * @returns {string}
 */
export function gla( argv, quite = false ) {
    
    return GitLabAPI[ entryPoint ]( argv, quite )
}

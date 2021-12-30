#!/usr/bin/env node
import { gla } from './index.js'

// It gets the command line arguments splicing out from `process.argv` the paths for node and executable.js
process.argv.splice( 0, 2 )

/**
 * Entry point to gitlab-API.
 */
await gla( process.argv )


# GitLab-API

> ℹ️ ALPHA RELEASE AHEAD, works in progress ⏳

___

Some useful API for gitlab. Create and delete a project. Javascript ESM module and shell application.

> ℹ️ Javascript ESM module.

___

## Index of Contents

- [Installation](#installation)

- [Shell Usage](#shell-usage)

  - [Create a project with shell](#create-a-project-with-shell)
  - [Delete a project with shell](#delete-a-project-with-shell)
  - [Save access token to global config file with shell](#save-access-token-to-global-config-file-with-shell)

- [Functions &amp; Examples](#)

  - [Create a project](#create-a-project)
  - [Delete a project](#delete-a-project)
  - [Save access token to global config file](#save-access-token-to-global-config-file)

___

### Installation

- Install it as a global package.
```shell
npm i -g gla
```

- Install it as a devDependency module for your project.

```shell
npm i -D gla
```

- Install it as a dependency module for your project.
```shell
npm i gla
```

___

> ℹ️ Saving the access token to global config file, will turn of the use of the `token` flag for both, shell and module.  
> ℹ️ It makes a folder in the home directory `/HOME_DIR/.gla`, and it saves the file `config.json` inside it.

### Shell Usage

- #### Create a project with shell

```shell
gla create PROJECT_NAME visibility public token YOUR_ACCESS_TOKEN
```

___

- #### Delete a project with shell

```shell
gla delete PROJECT_ID token YOUR_ACCESS_TOKEN
```

___

- #### Save access token to global config file with shell

```shell
gla config global token YOUR_ACCESS_TOKEN
```

___

### Functions &amp; Examples

- #### Create a project

```javascript
import { gla } from 'gla'

const response = await gla(
    [ 'create', 'test', 'visibility', 'public', 'token', 'YOUR_ACCESS_TOKEN' ],
    true // silence the std output when using gla as a devDependency|dependency in your project
)
console.log(response)
```

___

- #### Delete a project

```javascript
import { gla } from 'gla'

const response = gla(
    [ 'delete', 'PROJECT_ID', 'token', 'YOUR_ACCESS_TOKEN' ],
    true // silence the std output when using gla as a devDependency|dependency in your project
)
console.log(response)
```

___

- #### Save access token to global config file

```javascript
import { gla } from 'gla'

const response = gla(
    [ 'config', 'global', 'token', 'YOUR_ACCESS_TOKEN' ],
    true // silence the std output when using gla as a devDependency|dependency in your project
)
console.log(response)
```

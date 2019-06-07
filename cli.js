#!/usr/bin/env node

/**
 * @author              Nathan Mersha
 * @name                GenNode Authorization
 * @module              cli.js
 * @description         Command line interface
 * @kind                Interface
 * @copyright           June 2019 GenNode Authorization
 */

let
    program                 = require('commander'),
    inquirer                = require('inquirer'),
    defaultValues           = require('./src/config'),
    npmPackage              = require('./package.json'),
    genNodeAuthorization    = require('./main');

const prefixMessage = ">";
    

let questions = [
    {
        type : 'input',
        prefix : '\n\nWelcome to GenNode Authorization. \n\nThis will walk you through creating a genNodeAuthorization.config.js configuration file. For more help type [ gennode --help ]\n' +
        'If you leave a field empty, it will be assigned a default value. \nAfter you are done generating the file, print [ gennode_auth gen -i genNodeAuthorization.config.js -o . ] and a server file will be \ngenerated' +
        ' inside the current directory according to your configuration.>',
        default : defaultValues.serviceName,
        name : 'serviceName',
        message : `Name`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.serviceDescription,
        name : 'serviceDescription',
        message : `Description`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.author,
        name : 'author',
        message : `Author`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.copyright,
        name : 'copyright',
        message : `Copyright`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.repoURL,
        name : 'repoURL',
        message : `RepoURL`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.licence,
        name : 'licence',
        message : `Licence`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.version,
        name : 'version',
        message : `Version`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.baseURL,
        name : 'baseURL',
        message : `BaseURL`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.DEBUG,
        name : 'debug',
        message : `Debug`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.PORT,
        name : 'port',
        message : `Port`
    },


    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.MONGODB_URL,
        name : 'mongodbURL',
        message : `Mongodb URL`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.REVERSE_PROXY,
        name : 'reverseProxy',
        message : `Reverse Proxy`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.COLLECTION_RETURN_SIZE,
        name : 'collectionReturnSize',
        message : `Collection default size`
    },


    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.ELASTIC_SEARCH_URL,
        name : 'elasticSearchURL',
        message : `Elastic search url`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.TOKEN_EXPIRATION_TIME,
        name : 'tokenExpirationTime',
        message : `Token expiration time`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.LOG_STASH_PORT,
        name : 'logStashPort',
        message : `Log stash port`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.SECRET,
        name : 'secret',
        message : `Secret string to hash (Don't commit)`
    },
    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.docker,
        name : 'docker',
        message : `Generate Docker files`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.jenkins,
        name : 'jenkins',
        message : `Generate Jenkins file`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.postman,
        name : 'postman',
        message : `Generate postman file`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.useProxy,
        name : 'proxy',
        message : `Reverse proxy`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.test,
        name : 'test',
        message : `Generate Test`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.documentation,
        name : 'documentation',
        message : `Generate Documentation`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.readMe,
        name : 'readMe',
        message : `Generate ReadMe`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.instance,
        name : 'instance',
        message : `App Instance (Input 0 will utilize the whole logical core)`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.commit,
        name : 'commit',
        message : `Commit files`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.runServer,
        name : 'runServer',
        message : `Run server`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.commitMessage,
        name : 'commitMessage',
        message : `Commit message`
    },
];

program
    .version(npmPackage.version)
    .description('Simple NodeJs authorization server generator module.');

program
    .command('initialize')
    .alias('init')
    .description("Generates genNodeAuthorization configuration file, with interactive prompt.")
    .action(function () {
        inquirer.prompt(questions).then(answers =>
            genNodeAuthorization.generateConfig(answers)
        );
    });

program
    .command('sample')
    .alias('s')
    .description("Generates a sample genNodeAuthorization configuration file for a hero academy")
    .action(function () {
        genNodeAuthorization.generateSampleConfig();
    });


program
    .command('generate -i <configFilePath> -o <outputPath> ')
    .alias('gen')
    .option('-i, --input', 'Path to the gen node configuration file.')
    .option('-o, --output', 'Path to where the server files will be generated.')
    .description("Path to gen node configuration file.")
    .action(function (configFilePath, outputPath) {
        genNodeAuthorization.genNodeAuthorization(configFilePath, outputPath);
    });



program.parse(process.argv);

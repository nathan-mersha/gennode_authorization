/**
 * @author              __author__
 * @name                __serviceName__
 * @module              schema.js
 * @description         Defines model for schema
 * @kind                Model
 * @copyright           __copyright__
 */
let
    mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    config                  = require('../config'),
    mongoosastic            = require('mongoosastic'),
    debug                   = require('debug')('__serviceName__/model/schema'),
    mongoosePaginate        = require('mongoose-paginate');

let schema = new Schema({
    // Schema definition begins here
    schemaName      : {type:String,es_indexed:true, required : true}, // Defines schema name (ex : "Fruit", "Company")
    serviceName     : {type:String,es_indexed:true},
    accessControl   : { // Defines roles, Creator, Admin 1, Admin 2
        read    : [{type : String, es_indexed : true}], // 
        update  : [{type : String, es_indexed : true}],
        delete  : [{type : String, es_indexed : true}]
    },
    documentIds     : [{type : String}], // ObjectIds of the schema
    firstModified   : {type : Date, es_indexed : true},
    lastModified    : {type : Date, es_indexed : true}
    // Schema definition ends here
});


/*
 Adding plugins
 */
schema.plugin(mongoosePaginate);

/*
 Adding plugin
 */
schema.plugin(mongoosastic,{
    hosts : [
        String(config.ELASTIC_SEARCH_URL), // Adding elastic search url for latter search indexing...
    ]
});


// Updating time Stamp of first and last modified before initial save
schema.pre('save',function preSave(next) {
    let schemaSchema  = this;
    let now = new Date();

    if(!schemaSchema.firstModified ){  // Saving for the first time
        schemaSchema.firstModified  = now.toISOString();
        schemaSchema.lastModified   = now.toISOString();
        next();
    }else{ // Saving Modified data
        schemaSchema.lastModified   = now.toISOString();
        next();
    }
});

let schemaSchema = mongoose.model('schema', schema);

/**
 * @description     - Creating mapping with elastic search
 */
schemaSchema.createMapping(function (err,mapping) {
    if(err){
        debug(`Error while mapping`);
        debug(`Error is : ${err}`);
    }else{
        debug(`Successful Mapping`);
        debug(`${mapping}`);
    }
});

module.exports = schemaSchema;
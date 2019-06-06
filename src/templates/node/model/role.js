/**
 * @author             Nathan Mersha
 * @name               gennodeAuthServer
 * @description        Manages role for gennodeAuthServer
 * @kind               Model
 * @module             Defines role model
 * @copyright          Copyright : 2019
 */

let
    mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    config              = require('../config'),
    mongoosastic        = require('mongoosastic'),
    constants           = require('../lib/constant').constant,
    debug               = require('debug')('gennodeAuthServer/model/role'),
    mongoosePaginate    = require('mongoose-paginate');


let role = new Schema({
    // Schema definition begins here
    name            : {type : String,es_indexed:true, required : true},
    description     : {type : String,es_indexed:true},
    members         : [{type : Schema.Types.ObjectId, ref:'user'}],
    accessRoutes    : [{
        route  : {type : String, es_indexed : true},
        method : {type : String, enum : constants.METHODS}
    }],
    firstModified   : {type : Date, es_indexed : true},
    lastModified    : {type : Date, es_indexed : true}
    // Schema definition ends here
});


/*
 Adding plugins
 */
role.plugin(mongoosePaginate);

/*
 Adding plugin
 */
role.plugin(mongoosastic,{
    hosts : [
        String(config.ELASTIC_SEARCH_URL), // Adding elastic search url for latter search indexing...
    ]
});


// Updating time Stamp of first and last modified before initial save
role.pre('save',function preSave(next) {
    let roleSchema  = this;
    let now = new Date();

    if(!roleSchema.firstModified ){  // Saving for the first time
        roleSchema.firstModified  = now.toISOString();
        roleSchema.lastModified   = now.toISOString();
        next();
    }else{ // Saving Modified data
        roleSchema.lastModified   = now.toISOString();
        next();
    }
});

let roleSchema = mongoose.model('role', role);

/**
 * @description     - Creating mapping with elastic search
 */
roleSchema.createMapping(function (err,mapping) {
    if(err){
        debug(`Error while mapping`);
        debug(`Error is : ${err}`);
    }else{
        debug(`Successful Mapping`);
        debug(`${mapping}`);
    }
});

module.exports = roleSchema;
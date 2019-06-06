/**
 * @author              __author__
 * @name                __serviceName__
 * @description        Defines Acm model
 * @kind               Model
 * @copyright          __copyright__
 */

let
    mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    config                  = require('../config'),
    mongoosastic            = require('mongoosastic'),
    debug                   = require('debug')('__serviceName__/model/acm'),
    mongoosePaginate        = require('mongoose-paginate');

let acm = new Schema({
    // Schema definition begins here
    subject         : {type:String,es_indexed:true, required : true}, // User id, any
    accessControl   : {
        read    : [{type : String, es_indexed : true}],
        update  : [{type : String, es_indexed : true}],
        delete  : [{type : String, es_indexed : true}]
    },
     firstModified  : {type : Date, es_indexed : true},
     lastModified   : {type : Date, es_indexed : true}
    // Schema definition ends here
});


/*
 Adding plugins
 */
acm.plugin(mongoosePaginate);

/*
 Adding plugin
 */
acm.plugin(mongoosastic,{
    hosts : [
        String(config.ELASTIC_SEARCH_URL), // Adding elastic search url for latter search indexing...
    ]
});


// Updating time Stamp of first and last modified before initial save
acm.pre('save',function preSave(next) {
    let acmSchema  = this;
    let now = new Date();

    if(!acmSchema.firstModified ){  // Saving for the first time
        acmSchema.firstModified  = now.toISOString();
        acmSchema.lastModified   = now.toISOString();
        next();
    }else{ // Saving Modified data
        acmSchema.lastModified   = now.toISOString();
        next();
    }
});

let acmSchema = mongoose.model('acm', acm);

/**
 * @description     - Creating mapping with elastic search
 */
acmSchema.createMapping(function (err,mapping) {
    if(err){
        debug(`Error while mapping`);
        debug(`Error is : ${err}`);
    }else{
        debug(`Successful Mapping`);
        debug(`${mapping}`);
    }
});

module.exports = acmSchema;
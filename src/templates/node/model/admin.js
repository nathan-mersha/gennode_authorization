/**
 * @author              __author__
 * @name                __serviceName__
 * @module              admin.js
 * @description         Defines model for admin
 * @kind                Model
 * @copyright           __copyright__
 */

let
    mongoose         = require('mongoose'),
    bcrypt           = require('bcryptjs'),
    async            = require('async'),
    Schema           = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    config           = require('../config');

let admin = new Schema({
    // Schema definition begins here
    email           : {type : String},
    userName        : {type : String, required : true, unique : true},
    password        : {type : String, required : true},
    role            : {type : String, default : "Admin", enum : ["Admin", "SuperAdmin"]},
    firstModified   : {type : Date, es_indexed : true},
    lastModified    : {type : Date, es_indexed : true}
    // Schema definition ends here
});


/*
 Adding plugins
 */
admin.plugin(mongoosePaginate);

/**
 * @name            - Verify password
 * @description     - Checking password against an already hashed password.
 * @param password  - Password to compare
 * @param callback  - Callback function (err,isValid)
 */
admin.methods.verifyPassword = function verifyPassword(password,callback) {
    bcrypt.compare(password,this.password,callback);
};

/**
 * @description     - Defines a pre save operation
 */
admin.pre('save',function modifyData(next) {
    let now        = new Date(); // defines current time.
    let adminSchema = this; // defines the schema object

    // Saving for the first time
    if(!adminSchema.firstModified){
        
        /*
        Begin execution
         */
        async.waterfall([
            updatingTime,
            hashingPassword],function () {
            next();
        });

        /**
         * @name            - Updating time
         * @description     - Updating log time of both first and last modified
         * @param callback  - Callback function (error)
         */
        function updatingTime(callback) {
            // Updating time
            adminSchema.firstModified = now.toISOString();
            adminSchema.lastModified = now.toISOString();
            callback(null);
        }

        /**
         * @name            - Hashing password
         * @description     - Hashing password.
         * @param callback  - Callback function (error)
         */
        function hashingPassword(callback) {
            // hashing password
            bcrypt.genSalt(Number(config.SALT_LENGTH),function (err,salt) { // generating salt.
                bcrypt.hash(adminSchema.password,salt,function (err,hashedPassword) { // hashing password.
                    adminSchema.password = hashedPassword;
                    callback(null);
                });
            });
        }
    }

    else{  // Modifying saved data
        adminSchema.lastModified = now.toISOString();
        next();
    }
});

module.exports = mongoose.model('admin', admin);
/**
 * @author              __author__
 * @name                __serviceName__
 * @module              admin.js
 * @description         DAL for admin model.
 * @kind                DAL
 * @copyright           __copyright__
 */

let
    Model       = require('../model/admin'),
    constants   = require('../lib/constant'),
    errorCodes  = constants.errorCodes,
    bcrypt      = require('bcryptjs');

/**
 * @name                - Create
 * @description         - Creates new acm
 * @param data          - Initial data
 * @param callback      - Callback function (error,data)
 */
exports.create                  = function create(data,callback)                            {
    Model.create(data, callback);
};

/**
 * @name                - Get public
 * @description         - Retrieves acm data that is public (some attributes may be hidden)
 * @param query         - Query
 * @param callback      - Callback function (error,data)
 */
exports.getPublic               = function getPublic(query, callback)                       {
    Model.findOne(query, callback);
};

/**
 * @name                - Get private
 * @description         - Retrieves private acm data
 * @param query         - Query
 * @param callback      - Callback function (error,data)
 */
exports.getPrivate              = function getPrivate(query, callback)                      {
    Model.findOne(query, callback);
};

/**
 * @name                - Get collections Paginated
 * @description         - Retrieves acm paginated data (public data - Attributes may be hidden)
 * @param query         - Query
 * @param option        - Pagination option (View documentation to view these options)
 * @param callback      - Callback function (error,data)
 */
exports.getCollectionsPaginated = function getCollectionsPaginated(query,option,callback)   {
    Model.paginate(query,option,function (err,data) {
        callback(err, data);
    });
};

/**
 * @name                - Get all collection
 * @description         - Retrieves all data that matches the query
 * @param query         - Query to look for.
 * @param callback      - Callback function (error,datas)
 */
exports.getAllCollection        = function getAllCollection(query, callback)                {
    Model.find(query,callback);
};

/**
 * @name                - Count
 * @description         - Count documents based on query
 * @param query         - Query
 * @param callback      - Callback function (error,count)
 */
exports.count = function (query, callback) {
    Model.countDocuments(query,callback);
};

/**
 * @name                - Update
 * @description         - Finds one acm that matches query and updates
 * @param query         - Query
 * @param updateData    - Update data
 * @param callback      - Callback function (error,data)
 */
exports.update                  = function update(query,updateData,callback)                {
    Model.findOneAndUpdate(query, updateData, {new: true}, callback);
};

/**
 * @name                - Update many
 * @description         - Finds all acm data that matches query and update
 * @param query         - Query
 * @param updateData    - Update data
 * @param callback      - Callback function (error,data)
 */
exports.updateMany              = function updateMany(query,updateData,callback)            {
    Model.updateMany(query, updateData, callback);
};

/**
 * @name                - Remove
 * @description         - Finds acm and removes.
 * @param query         - Query
 * @param callback      - Callback function (error,data)
 */
exports.remove                  = function remove(query,callback)                           {
    Model.findOneAndRemove(query,callback);
};

/**
 * @name                - Remove many
 * @description         - Removes all acm document that matches query
 * @param query         - Query
 * @param callback      - Callback function (error,data)
 */
exports.removeMany              = function removeMany(query,callback)                       {
    Model.deleteMany(query,callback);
};

/**
 * @name                - Compare password
 * @description         - Compares the provided password with the one find by the query
 * @param query         - Query
 * @param password      - Input password
 * @param callback      - Callback function (error, isValid)
 */
exports.comparePassword         = function (query, password,callback) {
    Model.findOne(query,function (err,data) {
        if(err){
            callback(err, null);
        }else if(data){
            bcrypt.compare(password,data.password,function (err,isValid) {
                if(err){
                    callback(errorCodes.SEC.SERVER_SIDE_ERROR.errorMessage,null);
                }else{
                    callback(null,isValid);
                }
            });
        }else if(!data){
            callback(`Could not find user by query : ${JSON.stringify(query)}`, false);
        }
    });
};
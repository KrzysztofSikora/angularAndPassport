/**
 * Created by krzysztof on 23.06.16.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


var UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    firstname: {
        type: String,
        trim: true
    },
    lastname: {
        type: String,
        trim: true
    }
});


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(u, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(u.password, salt, function(err, hash) {
            u.password = hash;
            u.save(callback);
        });
    });
}

module.exports.getUserByUsername = function (username, callback) {
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch)
    });
}
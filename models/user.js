const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: String,
    provider: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
})

userSchema.statics.findOrCreateByAuth = function findOrCreateByAuth (id, name, provider, done) {
    return this.update(
        // Recherche
        { _id: id, provider },
        // Mise à jour (l'id est supposé être celui de la recherche)
        { $set: { name }, $setOnInsert: { joinedAt: Date.now() } },
        // Activation du mode upsert (insertion si non trouvé)
        { upsert: true },
        (err) => done(err, id)
    )
}

userSchema.statics.getEntry = function getEntry (id) {
    return this.findById(id).populate('_id name provider joinedAt').exec()
}

const Model = mongoose.model('User', userSchema)

module.exports = Model

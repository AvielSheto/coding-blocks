const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    _id: String,
    code: String,
    solution: String
});

const Document = mongoose.model('document', DocumentSchema);
module.exports = Document;
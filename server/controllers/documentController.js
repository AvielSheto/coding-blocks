const Document = require('../models/DocumentModel')
const defaultValue = ""

const findOrCreateDocument = async (id) => {
    if (id == null) return
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, code: defaultValue })
}

module.exports = { findOrCreateDocument }
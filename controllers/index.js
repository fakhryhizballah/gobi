const Document = require('../models/Document');

const getAllDocuments = async (req, res) => {
  try {
    const { user } = req.params;
    if (!user) {
      return res.status(401).json({ error: 'User is Required' });
    }
    const documents = await Document.find({ user, status: 'active' });
    if (documents.length <= 0) {
      return res.status(404).json({ error: 'Documents not found' });
    }
    return res.status(200).json(documents);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch documents' });
  }
};
const postDocument = async (req, res) => {
  try {
    const body = req.body;
    if (!body.user || !body.document_type || !body.file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    body.status = 'active';
    body.createdAt = new Date();
    const document = new Document({ ...body });
    await document.save();
    return res.status(201).json(document);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to save document' });
  }
}
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findOneAndUpdate({
      _id: id,
      status: 'active'
    }, {
      $set: {
        ...req.body,
        updatedAt: new Date()
      }
    });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    return res.status(200).json(document);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update document' });
  }
}
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findOneAndUpdate({
      _id: id,
      status: 'active'
    }, {
      $set: {
        status: 'deleted',
        deletedAt: new Date()
      }
    });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    return res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete document' });
  }
};

module.exports = {
  getAllDocuments,
  postDocument,
  deleteDocument,
  updateDocument,
  
};
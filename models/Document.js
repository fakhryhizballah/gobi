const mongoose = require('mongoose');

const docsSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    document_type: {
      type: String,
      required: true
    },
    file: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true
    }
  },
  { strict: false },
  { timestamps: true }
);

module.exports = mongoose.model('Document', docsSchema);

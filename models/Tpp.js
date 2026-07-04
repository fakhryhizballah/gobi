const mongoose = require('mongoose');

const TppSchema = new mongoose.Schema(
  {
    periode: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    "NIP Pegawai": {
      type: String,
      required: true
    },
    "Jumlah TPP": {
      type: String,
      required: true
    }
  },
  { strict: false },
  { timestamps: true }
);
// Membuat kombinasi nama_pegawai dan periode menjadi unik
TppSchema.index({ nip_pegawai: 1, periode: 1 }, { unique: true });

module.exports = mongoose.model('Tpp', TppSchema);

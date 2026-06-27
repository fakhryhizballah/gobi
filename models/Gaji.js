const mongoose = require('mongoose');

const gajiSchema = new mongoose.Schema(
  {
    periode: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    },
    nama_pegawai: {
      type: String,
      required: true
    },
    jumlah_ditransfer: {
      type: String,
      required: true
    }
  },
  { strict: false },
  { timestamps: true }
);
// Membuat kombinasi nama_pegawai dan periode menjadi unik
gajiSchema.index({ nip_pegawai: 1, periode: 1 }, { unique: true });

module.exports = mongoose.model('Gaji', gajiSchema);

'use client';

import { useState } from 'react';
import { Info, X, HardDrive, Trash2, Image as ImageIcon, FileText } from 'lucide-react';

export default function DataCleanupModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-[10px] sm:text-xs font-bold text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm bg-white"
      >
        <Info className="w-3.5 h-3.5" /> Kelola Data
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <HardDrive className="w-6 h-6" />
                </div>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-lg font-black text-gray-900 font-heading mb-2">Panduan Kelola Data</h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Untuk mengurangi pemakaian penyimpanan server dan mencegah server penuh, Admin dapat melakukan pembersihan secara mandiri dengan menghapus data-data yang sudah usang atau tidak relevan lagi.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <ImageIcon className="w-4 h-4 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Foto & Galeri Lama</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Hapus foto-foto beresolusi tinggi di menu Galeri yang umurnya sudah lebih dari beberapa tahun untuk menghemat ruang *Storage*.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <FileText className="w-4 h-4 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">Berita & Layanan Usang</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Hapus artikel pengumuman lama yang tidak memiliki nilai informasi lagi untuk meringankan *Database* teks.</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, QrCode, Printer } from 'lucide-react';

const DoctorQRModal = ({ isOpen, onClose, doctorData }) => {
  const [copied, setCopied] = useState(false);
  const printRef = useRef();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(doctorData.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write(`
      <html>
        <head>
          <title>Doctor QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 12px;
              text-align: center;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              max-width: 400px;
            }
            .qr-section {
              margin-bottom: 30px;
            }
            .qr-image {
              width: 300px;
              height: 300px;
              margin-bottom: 20px;
            }
            .doctor-info {
              text-align: center;
            }
            .doctor-name {
              font-size: 24px;
              font-weight: bold;
              color: #1f2937;
              margin: 0 0 8px 0;
            }
            .doctor-specialty {
              font-size: 16px;
              color: #059669;
              font-weight: 600;
              margin: 0 0 4px 0;
            }
            .doctor-degree {
              font-size: 14px;
              color: #6b7280;
              margin: 0;
            }
            @media print {
              body {
                background: white;
              }
              .container {
                box-shadow: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="qr-section">
              <img src="${doctorData.qrImage}" alt="Doctor QR Code" class="qr-image" />
            </div>
            <div class="doctor-info">
              <p class="doctor-name">${doctorData.doctorName || 'Dr. [Name]'}</p>
              <p class="doctor-specialty">${doctorData.specialty || 'Specialization'}</p>
              <p class="doctor-degree">${doctorData.degree || 'Degree'}</p>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${doctorData.doctorName || 'Doctor'} - NiramoyAI`,
          text: `Scan my QR code to access my medical profile - ${doctorData.specialty || 'Medical Professional'}`,
          url: doctorData.link,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl border border-gray-700"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">My QR Code</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* QR Code Display */}
            <div ref={printRef} className="text-center mb-6 bg-white rounded-xl p-6">
              <div className="mb-4">
                <img
                  src={doctorData.qrImage}
                  alt="Doctor QR Code"
                  className="w-40 h-40 mx-auto"
                />
              </div>
              <div className="text-left mx-auto">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {doctorData.doctorName || 'Dr. [Name]'}
                </h3>
                <p className="text-emerald-600 font-semibold text-sm mb-1">
                  {doctorData.specialty || 'Specialization'}
                </p>
                <p className="text-gray-600 text-xs">
                  {doctorData.degree || 'Degree'}
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-sm text-center mb-6">
              Share this QR code to allow patients to grant you access to their health profiles
            </p>

            {/* Shareable Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Shareable Link
              </label>
              <div className="flex items-start space-x-2">
                <div className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono border border-gray-600 break-all leading-relaxed max-h-20 overflow-y-auto">
                  {doctorData.link}
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                    copied
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-400 text-xs mt-1"
                >
                  Link copied to clipboard!
                </motion.p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handlePrint}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print QR Code</span>
              </button>
              
              <div className="flex space-x-3">
                {navigator.share && (
                  <button
                    onClick={handleShare}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Info Text */}
            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-400 text-center">
                Patients can scan this QR code to grant you access to their health profiles and medical information.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DoctorQRModal;

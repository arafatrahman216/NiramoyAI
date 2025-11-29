import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, QrCode } from 'lucide-react';

const QRModal = ({ isOpen, onClose, qrData }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrData.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Health Profile - NiramoyAI',
          text: 'View my health profile and medical information',
          url: qrData.link,
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
                <h2 className="text-xl font-bold text-white">{t('qrModal.shareableProfile')}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* QR Code Display */}
            <div className="text-center mb-6">
              <div className="bg-white rounded-2xl p-4 inline-block shadow-lg">
                <img
                  src={qrData.qrImage}
                  alt="QR Code for Profile"
                  className="w-48 h-48 mx-auto"
                />
              </div>
              <p className="text-gray-400 text-sm mt-3">
                {t('qrModal.scanQrCode')}
              </p>
            </div>

            {/* Shareable Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('qrModal.shareableLink')}
              </label>
              <div className="flex items-start space-x-2">
                <div className="flex-1 bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 font-mono border border-gray-600 break-all leading-relaxed">
                  {qrData.link}
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
                  {t('qrModal.linkCopied')}
                </motion.p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t('qrModal.share')}</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                {t('qrModal.close')}
              </button>
            </div>

            {/* Info Text */}
            <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-400 text-center">
                {t('qrModal.infoText')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRModal;
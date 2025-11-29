import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const HospitalSearchInput = ({ searchTerm, onSearchChange, totalCount }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={t('hospitalSearch.searchPlaceholder')}
          className="w-full pl-10 pr-4 py-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white placeholder-zinc-400 focus:border-white focus:ring-2 focus:ring-white/20 focus:outline-none transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm text-zinc-400">
        <span>
          {t('hospitalSearch.resultsCount', { count: totalCount })}
        </span>
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
          >
            {t('hospitalSearch.clearSearch')}
          </button>
        )}
      </div>
    </div>
  );
};

export const HospitalSearchResults = ({ hospitals, hasMore, onLoadMore }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-10">
      {hospitals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center bg-zinc-900/60 border border-dashed border-zinc-700 rounded-2xl"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800/80 text-emerald-300 mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m2 5H7a2 2 0 01-2-2V8a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v8a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">{t('hospitalSearch.noHospitalsFound')}</h3>
          <p className="text-zinc-500 text-sm max-w-md">
            {t('hospitalSearch.noHospitalsDescription')}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hospitals.map((hospital, index) => (
              <motion.div
                key={hospital.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)] transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-500/0 to-blue-500/0 group-hover:from-emerald-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white leading-tight">{hospital.name}</h3>
                      <p className="text-sm text-emerald-300 mt-1 font-medium">{hospital.feeRange}</p>
                    </div>
                    <span className="text-xs text-zinc-500 bg-zinc-800/80 px-2 py-1 rounded-full">{t('hospitalSearch.profile')}</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm text-zinc-400">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.656 0 3-1.343 3-3s-1.344-3-3-3-3 1.343-3 3 1.344 3 3 3z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c4-4 6-7.333 6-11a6 6 0 10-12 0c0 3.667 2 7 6 11z" />
                      </svg>
                      <span>{hospital.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 mt-0.5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14c-3.865 0-7 1.567-7 3.5V20h14v-2.5c0-1.933-3.135-3.5-7-3.5z" />
                      </svg>
                      <a href={`mailto:${hospital.email}`}>{hospital.email}</a>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-xs uppercase tracking-wide text-zinc-500">{t('hospitalSearch.verifiedHospital')}</span>
                    <a
                      href={hospital.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors"
                    >
                      {t('hospitalSearch.visitProfile')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m0 0H9m6 0v6" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onLoadMore}
                className="px-6 py-3 border border-emerald-500/50 text-emerald-300 rounded-xl font-semibold hover:bg-emerald-500/10 transition-all"
              >
                {t('hospitalSearch.loadMore')}
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

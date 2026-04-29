import { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import {
  getTeacherPendingApplications,
  getTeacherApprovedStudents,
  approveApplication,
  rejectApplication,
  getPersonalChatMessages,
  sendPersonalMessage,
  getTeacherGroups,
  createTeacherGroup,
  updateGroupName,
  deleteTeacherGroup,
  getTeacherConferences,
  addConference,
  deleteConference,
  gradeTask,
  initDemoData
} from './utils/systemStorage';

// ... (ВСЕ ИКОНКИ И ФУНКЦИИ-ПОМОЩНИКИ ОСТАЮТСЯ БЕЗ ИЗМЕНЕНИЙ, КРОМЕ ИКОНОК НАВИГАЦИИ) ...

// Иконки навигации — добавляем адаптивность
const HomeIcon = ({ active, isDark }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-200 hover:scale-110 ${active ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.69-8.69a2.25 2.25 0 00-3.18 0l-8.69 8.69a.75.75 0 001.06 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159a2.25 2.25 0 01.659 1.591v5.568a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75v-4.5c0-.414-.336-.75-.75-.75h-3c-.414 0-.75.336-.75.75v4.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-5.568a2.25 2.25 0 01.659-1.591L12 5.432z" />
  </svg>
);

const ServicesIcon = ({ active, isDark }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-200 hover:scale-110 ${active ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
    <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6zm1.5 1.5h9A1.5 1.5 0 0118 6v12a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 015.5 18V6A1.5 1.5 0 017 4.5zm2 3a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm0 3a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm0 3a.75.75 0 000 1.5h4a.75.75 0 000-1.5H9z" clipRule="evenodd" />
  </svg>
);

const CheckIcon = ({ active, isDark }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-200 hover:scale-110 ${active ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
    <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM9 12a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm0 3a.75.75 0 000 1.5h4a.75.75 0 000-1.5H9z" clipRule="evenodd" />
  </svg>
);

const ProfileIcon = ({ active, isDark }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-200 hover:scale-110 ${active ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ... (ОСТАЛЬНЫЕ ИКОНКИ БЕЗ ИЗМЕНЕНИЙ) ...

// ==================== ОСНОВНОЙ КОМПОНЕНТ ====================
function TeacherCabinet({ user, profile, onLogout }) {
  // ... (ВСЕ useState, useEffect И ФУНКЦИИ БЕЗ ИЗМЕНЕНИЙ) ...

  const theme = {
    bg: isDark ? 'bg-[#121218]' : 'bg-white', 
    header: isDark ? 'bg-[#121218]/80 backdrop-blur-md border-[#2A2A3A]' : 'bg-white/80 backdrop-blur-md border-gray-200',
    card: isDark ? 'bg-[#1E1E2A] border border-[#2A2A3A]' : 'bg-white border border-gray-200 shadow-sm', 
    cardInner: isDark ? 'bg-[#121218]' : 'bg-gray-50',
    text: isDark ? 'text-[#F1F5F9]' : 'text-[#1E293B]', 
    textSecondary: isDark ? 'text-[#94A3B8]' : 'text-[#64748B]', 
    textMuted: isDark ? 'text-[#64748B]' : 'text-[#94A3B8]',
    input: isDark ? 'bg-[#1E1E2A] border-2 border-[#A78BFA] text-white placeholder-gray-400' : 'bg-white border-2 border-[#2563EB] text-gray-800 placeholder-gray-400',
    inputChat: isDark ? 'bg-[#2A2A3A] border-2 border-[#A78BFA] text-white placeholder-gray-400' : 'bg-white border-2 border-[#2563EB] text-gray-800 placeholder-gray-400',
    bottomBar: isDark ? 'bg-[#1E1E2A]/90 backdrop-blur-xl border-[#2A2A3A]' : 'bg-white/90 backdrop-blur-xl border-gray-200 shadow-lg',
    myMessage: isDark ? 'bg-[#A78BFA] text-white' : 'bg-[#2563EB] text-white', 
    otherMessage: isDark ? 'bg-[#2E7D32] text-white' : 'bg-[#E8F5E9] text-gray-800',
    acceptBtn: 'bg-green-500 hover:bg-green-600 text-white', 
    rejectBtn: isDark ? 'bg-[#A78BFA] hover:bg-[#9B7BEA] text-white' : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white',
    progressBg: isDark ? 'bg-gray-700' : 'bg-gray-200',
  };

  // ... (ВСПОМОГАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ БЕЗ ИЗМЕНЕНИЙ) ...

  return (
    <div className={`min-h-screen pb-20 sm:pb-24 relative ${theme.bg}`}>
      <style>{scrollbarCSS}</style>

      {/* ХЕДЕР */}
      <div className={`px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-30 border-b ${theme.header}`}>
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-[#A78BFA] via-[#C4B5FD] to-[#A78BFA]' : 'from-[#2563EB] via-[#3B82F6] to-[#2563EB]'}`}>
            РТУ МИРЭА • Преподаватель
          </h1>
        </div>
      </div>

      {/* КОНТЕНТ */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 tab-content">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'services' && <ServicesScreen />}
        {activeTab === 'check' && <CheckScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* МОДАЛЬНЫЕ ОКНА — добавляем w-[95%] и адаптивные отступы */}
      {rejectDialog.show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className={`rounded-2xl w-[95%] sm:max-w-md p-4 sm:p-6 ${theme.card}`}>
            <h3 className={`text-lg font-bold mb-4 ${theme.text}`}>Причина отказа</h3>
            <div className="space-y-2 mb-4">
              {['Нет мест', 'Не подходит профиль'].map(r => (
                <button key={r} onClick={() => setRejectReason(r)} className={`w-full p-2 rounded-lg text-left text-sm ${rejectReason === r ? (isDark ? 'bg-[#A78BFA] text-white' : 'bg-[#2563EB] text-white') : theme.card}`}>{r}</button>
              ))}
            </div>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Или напишите причину..." className={`w-full p-2 rounded-lg text-sm mb-4 ${theme.input}`} rows="2" />
            <div className="flex gap-2 sm:gap-3">
              <button onClick={confirmReject} className={`flex-1 py-2 sm:py-2.5 rounded-lg text-sm font-medium ${theme.rejectBtn}`}>Отклонить</button>
              <button onClick={() => setRejectDialog({ show: false, application: null })} className={`flex-1 py-2 sm:py-2.5 rounded-lg text-sm ${theme.card} ${theme.text}`}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {showTopicModal && selectedDiplomnik && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className={`rounded-2xl w-[95%] sm:max-w-md p-4 sm:p-6 ${theme.card}`}>
            <h3 className={`text-lg font-bold mb-4 ${theme.text}`}>Утверждение темы</h3>
            <p className={`text-sm mb-2 ${theme.textSecondary}`}>Студент: {selectedDiplomnik.studentName}</p>
            <textarea value={editingTopic} onChange={(e) => setEditingTopic(e.target.value)} placeholder="Тема ВКР..." className={`w-full p-3 rounded-lg text-sm mb-4 ${theme.input}`} rows="3" />
            <div className="flex gap-2 sm:gap-3">
              <button onClick={saveTopic} className={`flex-1 py-2 sm:py-2.5 rounded-lg text-sm font-medium text-white ${isDark ? 'bg-[#A78BFA]' : 'bg-[#2563EB]'}`}>Утвердить</button>
              <button onClick={() => setShowTopicModal(false)} className={`flex-1 py-2 sm:py-2.5 rounded-lg text-sm ${theme.card} ${theme.text}`}>Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Остальные модальные окна аналогично с w-[95%] sm:max-w-md p-4 sm:p-6 */}
      
      {/* НИЖНЯЯ ПАНЕЛЬ НАВИГАЦИИ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-4 sm:pb-6 px-3 sm:px-4">
        <div className={`rounded-full px-1.5 sm:px-2 py-1.5 sm:py-2 shadow-2xl ${theme.bottomBar}`}>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {['home', 'services', 'check', 'profile'].map(id => {
              const icons = { home: HomeIcon, services: ServicesIcon, check: CheckIcon, profile: ProfileIcon };
              const labels = { home: 'Главная', services: 'Сервисы', check: 'Проверка', profile: 'Профиль' };
              const Icon = icons[id];
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`relative px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 flex flex-col items-center`}
                >
                  <Icon active={activeTab === id} isDark={isDark} />
                  <span className={`text-[10px] sm:text-xs font-medium mt-0.5 ${activeTab === id ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
                    {labels[id]}
                  </span>
                  {activeTab === id && (
                    <span className={`absolute bottom-[-4px] w-1 h-1 rounded-full ${isDark ? 'bg-[#A78BFA]' : 'bg-[#2563EB]'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherCabinet;
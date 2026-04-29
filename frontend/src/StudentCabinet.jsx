import { useState, useEffect, useRef } from 'react';
import { 
  getSystemData,
  getStudentApplications,
  getStudentApprovedTeacher,
  submitApplication,
  cancelApplication as cancelApplicationAPI,
  getPersonalChatMessages,
  sendPersonalMessage,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
  addNotification,
  getStudentTasks,
  submitTask,
  initDemoData,
  getFullTeachersList,
  getTeachersOnlineStatus,
  getStudentGroups
} from './utils/systemStorage';

// ==================== УТИЛИТЫ ====================
const detectGender = (fullName) => {
  if (!fullName) return 'Не указан';
  const lastName = fullName.split(' ')[0].trim();
  if (lastName.endsWith('а') || lastName.endsWith('я') || 
      lastName.endsWith('ова') || lastName.endsWith('ева') || 
      lastName.endsWith('ина')) return 'Женский';
  return 'Мужской';
};

const getTaskWord = (count) => {
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastTwo >= 11 && lastTwo <= 19) return 'заданий';
  if (lastDigit === 1) return 'задание';
  if (lastDigit >= 2 && lastDigit <= 4) return 'задания';
  return 'заданий';
};

// ==================== ИКОНКИ ====================
// Навигация
const HomeIcon = ({ active, isDark }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-200 hover:scale-110 ${active ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.69-8.69a2.25 2.25 0 00-3.18 0l-8.69 8.69a.75.75 0 001.06 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159a2.25 2.25 0 01.659 1.591v5.568a.75.75 0 01-.75.75h-5.25a.75.75 0 01-.75-.75v-4.5c0-.414-.336-.75-.75-.75h-3c-.414 0-.75.336-.75.75v4.5a.75.75 0 01-.75.75H3.75a.75.75 0 01-.75-.75v-5.568a2.25 2.25 0 01.659-1.591L12 5.432z" />
  </svg>
);

const CourseIcon = ({ active, isDark }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-200 hover:scale-110 ${active ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
    <path d="M12 3L1 9l11 6 11-6-11-6z" />
    <path d="M1 15l11 6 11-6" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const ServicesIcon = ({ active, isDark }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-200 hover:scale-110 ${active ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
    <path fillRule="evenodd" d="M6 3a3 3 0 00-3 3v12a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3H6zm1.5 1.5h9A1.5 1.5 0 0118 6v12a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 015.5 18V6A1.5 1.5 0 017 4.5zm2 3a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm0 3a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm0 3a.75.75 0 000 1.5h4a.75.75 0 000-1.5H9z" clipRule="evenodd" />
  </svg>
);

const ProfileIcon = ({ active, isDark }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 sm:w-6 h-5 sm:h-6 transition-all duration-200 hover:scale-110 ${active ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// Остальные иконки остаются без изменений...
// (SunIcon, MoonIcon, MegaphoneIcon, ChartIcon, FolderIcon, TeacherIcon, ChatIcon, ForumIcon, VideoIcon, DocumentIcon, DownloadIcon, CalendarIcon, NewsIcon, ClockIcon, ListIcon, EditIcon, DeleteIcon, SendIcon, ChevronDownIcon, CheckCircleIcon, CircleIcon, VKRIcon, GroupIcon)

// ==================== ДАННЫЕ ====================
// (NEWS, COURSE_ANNOUNCEMENTS, DEADLINES, DOCUMENTS, FORUM_QUESTIONS, VIDEOCONFERENCES, VKR_TASKS остаются без изменений)

// ==================== ОСНОВНОЙ КОМПОНЕНТ ====================
function StudentCabinet({ user, profile, onLogout }) {
  // (все useState остаются без изменений)

  const theme = {
    // (все значения темы остаются без изменений)
  };

  const noScrollbar = { scrollbarWidth: 'none', msOverflowStyle: 'none' };
  
  const scrollbarCSS = `
    html, body {
      background-color: ${isDark ? '#121218' : '#ffffff'};
      min-height: 100vh;
      margin: 0;
      padding: 0;
    }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .forum-scroll::-webkit-scrollbar { display: none; }
    .answers-scroll::-webkit-scrollbar { display: none; }
  `;

  return (
    <div className={`min-h-screen pb-20 sm:pb-24 relative ${theme.bg}`}>
      <style>{scrollbarCSS}</style>
      
      {/* Хедер */}
      <div className={`px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-30 border-b ${theme.header}`}>
        <div className="max-w-3xl mx-auto">
          <h1 className={`text-base sm:text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-[#A78BFA] via-[#C4B5FD] to-[#A78BFA]' : 'from-[#2563EB] via-[#3B82F6] to-[#2563EB]'}`}>РТУ МИРЭА • Студент</h1>
        </div>
      </div>
      
      {/* Контент */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 tab-content">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'course' && <CourseScreen />}
        {activeTab === 'services' && <ServicesScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </div>

      {/* Модальные окна */}
      {showConfirmModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className={`rounded-2xl w-[95%] sm:max-w-md p-4 sm:p-6 ${theme.card}`}>
            <h3 className={`text-lg sm:text-xl font-bold mb-2 flex items-center ${theme.text}`}>
              <TeacherIcon isDark={isDark} />
              Подтверждение записи
            </h3>
            <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${theme.textSecondary}`}>Записаться к {selectedTeacher.fullName}?</p>
            <div className="flex gap-2 sm:gap-3">
              <button onClick={confirmApply} className={`flex-1 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium text-white transition-all hover:scale-105 ${isDark ? 'bg-[#A78BFA]' : 'bg-[#2563EB]'}`}>Подтвердить</button>
              <button 
                onClick={() => setShowConfirmModal(false)} 
                style={isDark ? { color: '#FFFFFF' } : {}}
                className={`flex-1 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base transition-all hover:scale-105 ${theme.card}`}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className={`rounded-2xl w-[95%] sm:max-w-2xl max-h-[85vh] overflow-hidden ${theme.card}`}>
            <div className={`p-3 sm:p-4 border-b ${isDark ? 'border-[#2A2A3A]' : 'border-gray-200'} flex justify-between items-center`}>
              <h3 className={`font-semibold text-base sm:text-lg ${theme.text}`}>{selectedTask.name}</h3>
              <button onClick={() => setShowTaskModal(false)} className={`text-xl sm:text-2xl ${theme.textMuted}`}>✕</button>
            </div>
            <div className="p-3 sm:p-4 max-h-[60vh] overflow-y-auto space-y-3 sm:space-y-4 no-scrollbar" style={noScrollbar}>
              {/* Содержимое модалки задания */}
            </div>
            <div className={`p-3 sm:p-4 border-t ${isDark ? 'border-[#2A2A3A]' : 'border-gray-200'}`}>
              <button onClick={() => setShowTaskModal(false)} className={`w-full py-2 sm:py-2.5 rounded-lg text-sm sm:text-base ${theme.card} ${theme.text}`}>Закрыть</button>
            </div>
          </div>
        </div>
      )}

      {/* Нижняя панель навигации */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-4 sm:pb-6 px-3 sm:px-4">
        <div className={`rounded-full px-1.5 sm:px-2 py-1.5 sm:py-2 shadow-2xl ${theme.bottomBar}`}>
          <div className="flex items-center gap-0.5 sm:gap-1">
            {['home', 'course', 'services', 'profile'].map(id => {
              const icons = { home: HomeIcon, course: CourseIcon, services: ServicesIcon, profile: ProfileIcon };
              const labels = { home: 'Главная', course: 'Курс', services: 'Сервисы', profile: 'Профиль' };
              const Icon = icons[id];
              return (
                <button key={id} onClick={() => setActiveTab(id)} className={`relative px-3 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all duration-200 flex flex-col items-center`}>
                  <Icon active={activeTab === id} isDark={isDark} />
                  <span className={`text-[10px] sm:text-xs font-medium mt-0.5 ${activeTab === id ? (isDark ? 'text-[#A78BFA]' : 'text-[#2563EB]') : theme.textMuted}`}>{labels[id]}</span>
                  {activeTab === id && <span className={`absolute bottom-[-4px] w-1 h-1 rounded-full ${isDark ? 'bg-[#A78BFA]' : 'bg-[#2563EB]'}`} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentCabinet;
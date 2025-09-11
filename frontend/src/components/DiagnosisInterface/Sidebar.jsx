import React from 'react';
import { Plus, Home, Calendar, MessageCircle, User } from 'lucide-react';

// ==============================================
// SIDEBAR COMPONENT
// ==============================================
// Contains: Logo, New Chat, Navigation, Sign In
// Edit handleNavigation() to add routing/page changes
const Sidebar = ({ onVisitsClick, isVisitsSidebarOpen, onChatsClick, isChatsSidebarOpen, onNewChat }) => {
  // TODO: Add navigation logic here
  const handleNavigation = (section) => {
    console.log(`Navigate to: ${section}`);
    // Add your routing logic here (React Router, Next.js router, etc.)
  };

  // Handle visits/appointments sidebar
  const handleVisitsClick = () => {
    console.log('Toggling visits sidebar');
    if (onVisitsClick) {
      onVisitsClick();
    }
  };

  // Handle chats sidebar
  const handleChatsClick = () => {
    console.log('Toggling chats sidebar');
    if (onChatsClick) {
      onChatsClick();
    }
  };

  // NEW CHAT FUNCTIONALITY
  const handleNewChat = () => {
    console.log('Start new chat from sidebar');
    if (onNewChat) {
      onNewChat();
    }
  };

  // TODO: Add sign in functionality
  const handleSignIn = () => {
    console.log('Sign in clicked');
    // Add authentication logic here
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-4 space-y-6 z-50">
      {/* PERPLEXITY LOGO */}
      {/* Edit this section to change logo appearance */}
      <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
        <div className="w-6 h-6 bg-zinc-950 rounded-sm flex items-center justify-center">
          <div className="w-3 h-3 bg-white transform rotate-45"></div>
        </div>
      </div>
      
      {/* NEW CHAT BUTTON */}
      {/* Edit handleNewChat() to add new chat functionality */}
      <button 
        onClick={handleNewChat}
        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
        title="New Chat"
      >
        <Plus size={20} className="text-zinc-500 group-hover:text-zinc-300" />
      </button>
      
      {/* NAVIGATION MENU */}
      {/* Edit handleNavigation() to add routing for each section */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Home Section */}
        <div className="flex flex-col items-center space-y-2">
          <button 
            onClick={() => handleNavigation('home')}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
            title="Home"
          >
            <Home size={20} className="text-zinc-500 group-hover:text-zinc-300" />
          </button>
          <span className="text-xs text-zinc-600">Home</span>
        </div>
        
        {/* Chats Section */}
        <div className="flex flex-col items-center space-y-2">
          <button 
            onClick={handleChatsClick}
            className={`p-2 rounded-lg transition-colors group ${
              isChatsSidebarOpen 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'hover:bg-zinc-800 text-zinc-500'
            }`}
            title="Chats"
          >
            <MessageCircle size={20} className={`${
              isChatsSidebarOpen 
                ? 'text-emerald-400' 
                : 'text-zinc-500 group-hover:text-zinc-300'
            }`} />
          </button>
          <span className={`text-xs ${
            isChatsSidebarOpen ? 'text-emerald-400' : 'text-zinc-600'
          }`}>Chats</span>
        </div>
        
        {/* Visits Section */}
        <div className="flex flex-col items-center space-y-2">
          <button 
            onClick={handleVisitsClick}
            className={`p-2 rounded-lg transition-colors group ${
              isVisitsSidebarOpen 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'hover:bg-zinc-800 text-zinc-500'
            }`}
            title="Visits"
          >
            <Calendar size={20} className={`${
              isVisitsSidebarOpen 
                ? 'text-emerald-400' 
                : 'text-zinc-500 group-hover:text-zinc-300'
            }`} />
          </button>
          <span className={`text-xs ${
            isVisitsSidebarOpen ? 'text-emerald-400' : 'text-zinc-600'
          }`}>Visits</span>
        </div>
      </div>
      
      {/* SIGN IN BUTTON */}
      {/* Edit handleSignIn() to add authentication */}
      <button 
        onClick={handleSignIn}
        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors group"
        title="Sign In"
      >
        <User size={20} className="text-emerald-400 group-hover:text-emerald-300" />
      </button>
    </div>
  );
};

export default Sidebar;

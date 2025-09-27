import { Bell, User, Menu, X } from 'lucide-react';

export default function AdminHeader({ onToggleSidebar }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        
        <div className="flex items-center space-x-2 lg:space-x-4">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="hidden sm:flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Administrator</p>
              <p className="text-xs text-gray-600">admin@novitatravel.com</p>
            </div>
          </div>
          
          {/* Mobile user avatar */}
          <div className="sm:hidden flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
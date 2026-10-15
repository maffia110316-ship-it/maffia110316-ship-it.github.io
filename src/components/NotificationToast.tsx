import React, { useEffect } from 'react';
import { Bell, MessageSquare, Phone, UserPlus, X, Check, ArrowRight } from 'lucide-react';
import { UserAppNotification } from '../types';

interface NotificationToastProps {
  notification: UserAppNotification | null;
  onClose: () => void;
  onAction?: (notification: UserAppNotification) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onAction,
}) => {
  useEffect(() => {
    if (!notification) return;
    // Auto dismiss non-call notifications after 6 seconds
    if (notification.type !== 'call') {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-[#5865f2]" />;
      case 'call':
        return <Phone className="w-5 h-5 text-[#23a55a] animate-bounce" />;
      case 'friend_request':
        return <UserPlus className="w-5 h-5 text-[#f0b232]" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-4 duration-300">
      <div className="bg-[#1e1f22] border-2 border-[#5865f2] rounded-2xl p-4 shadow-2xl shadow-black/80 flex items-start space-x-3 text-white backdrop-blur-xl">
        {/* Avatar or Icon */}
        <div className="relative shrink-0">
          {notification.fromUser?.avatar ? (
            <img
              src={notification.fromUser.avatar}
              alt={notification.fromUser.username}
              className="w-11 h-11 rounded-full object-cover border-2 border-[#5865f2]"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-[#2b2d31] flex items-center justify-center">
              {getIcon()}
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 p-1 bg-[#2b2d31] rounded-full border border-[#1e1f22]">
            {getIcon()}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-white truncate">{notification.title}</h4>
            <span className="text-[10px] text-[#949ba4] font-medium">{notification.timeString}</span>
          </div>
          <p className="text-xs text-[#dbdee1] mt-0.5 line-clamp-2 leading-relaxed">
            {notification.body}
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-2 flex items-center space-x-2">
            {notification.type === 'call' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onAction?.(notification);
                    onClose();
                  }}
                  className="bg-[#23a55a] hover:bg-[#1f9350] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Aannemen</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#da373c] hover:bg-[#c02e33] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Weigeren
                </button>
              </>
            )}

            {notification.type === 'friend_request' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onAction?.(notification);
                    onClose();
                  }}
                  className="bg-[#23a55a] hover:bg-[#1f9350] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accepteren</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#2b2d31] hover:bg-[#35373c] text-[#dbdee1] text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                >
                  Later
                </button>
              </>
            )}

            {notification.type === 'message' && (
              <button
                type="button"
                onClick={() => {
                  onAction?.(notification);
                  onClose();
                }}
                className="bg-[#5865f2] hover:bg-[#4752c4] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-md"
              >
                <span>Bekijk Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="text-[#949ba4] hover:text-white p-1 rounded-lg hover:bg-[#2b2d31] transition shrink-0"
          title="Sluiten"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

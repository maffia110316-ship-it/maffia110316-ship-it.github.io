import React from 'react';
import { Bell, MessageSquare, Phone, UserPlus, Trash2, CheckCircle2, X } from 'lucide-react';
import { UserAppNotification } from '../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: UserAppNotification[];
  onClearAll: () => void;
  onNotificationClick: (notif: UserAppNotification) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onClearAll,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#2b2d31] border border-[#232428] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-[#1e1f22] border-b border-[#232428] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#5865f2]/20 text-[#5865f2] rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Meldingen & Activiteiten</h3>
              <p className="text-xs text-[#949ba4]">
                Berichten, oproepen en vriendschapsverzoeken
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-xs text-[#f23f43] hover:text-[#da373c] flex items-center space-x-1 p-1.5 rounded-lg hover:bg-[#111214] transition font-bold"
                title="Alles wissen"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Wissen</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[#949ba4] hover:text-white p-1.5 rounded-lg hover:bg-[#1e1f22] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-[#949ba4]">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#1e1f22] flex items-center justify-center text-2xl">
                🔕
              </div>
              <p className="text-sm font-bold text-white">Geen nieuwe meldingen</p>
              <p className="text-xs text-[#949ba4] mt-1">
                Wanneer vrienden berichten sturen of je bellen, verschijnen ze hier direct.
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onNotificationClick(notif);
                  onClose();
                }}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start space-x-3 hover:scale-[1.01] ${
                  notif.read
                    ? 'bg-[#1e1f22]/60 border-[#232428] text-[#949ba4]'
                    : 'bg-[#1e1f22] border-[#5865f2]/40 text-white shadow-md'
                }`}
              >
                {notif.fromUser?.avatar ? (
                  <img
                    src={notif.fromUser.avatar}
                    alt={notif.fromUser.username}
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#232428]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#2b2d31] flex items-center justify-center shrink-0">
                    {notif.type === 'message' && <MessageSquare className="w-5 h-5 text-[#5865f2]" />}
                    {notif.type === 'call' && <Phone className="w-5 h-5 text-[#23a55a]" />}
                    {notif.type === 'friend_request' && <UserPlus className="w-5 h-5 text-[#f0b232]" />}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{notif.title}</span>
                    <span className="text-[10px] text-[#949ba4] shrink-0 ml-2">{notif.timeString}</span>
                  </div>
                  <p className="text-xs text-[#dbdee1] mt-0.5 line-clamp-2">{notif.body}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

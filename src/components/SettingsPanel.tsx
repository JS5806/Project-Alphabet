import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppSettings } from '../types';
import { X, Bell, Link2, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const SettingsPanel: React.FC<Props> = ({ isOpen, onClose, settings, onSave }) => {
  const [formData, setFormData] = useState<AppSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        />
      )}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 p-6"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Bell className="w-5 h-5" /> 봇 설정
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Link2 className="w-4 h-4" /> Webhook URL (Slack/Teams)
            </label>
            <input
              type="url"
              value={formData.webhookUrl}
              onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
              placeholder="https://hooks.slack.com/..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
            />
            <p className="text-xs text-gray-400">결과 공유 시 사용할 웹훅 주소를 입력하세요.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">점심 알림 시간</label>
            <input
              type="time"
              value={formData.notificationTime}
              onChange={(e) => setFormData({ ...formData, notificationTime: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2
              ${isSaved ? 'bg-green-500' : 'bg-gray-900 hover:bg-black'}`}
          >
            {isSaved ? (
              <>
                <Check className="w-5 h-5" /> 저장 완료
              </>
            ) : (
              '설정 저장하기'
            )}
          </motion.button>
        </form>
      </motion.div>
    </>
  );
};

export default SettingsPanel;
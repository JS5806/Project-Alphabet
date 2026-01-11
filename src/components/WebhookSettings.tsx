import React, { useState } from 'react';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { webhookConfigState } from '../store/atoms';

const WebhookSettings: React.FC = () => {
  const [config, setConfig] = useRecoilState(webhookConfigState);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('설정이 저장되었습니다.');
  };

  const handleTest = async () => {
    if (!config.url) {
      alert('Webhook URL을 입력해주세요.');
      return;
    }

    setStatus('LOADING');
    try {
      // Slack Webhook Payload Example
      const payload = {
        text: "🍽️ [점심 추천 시스템] Webhook 연동 테스트 메시지입니다.",
      };

      // 실제 Slack Webhook은 CORS 정책으로 인해 클라이언트 직접 호출 시 문제가 발생할 수 있습니다.
      // 실무에서는 Proxy 서버나 Backend API를 경유해야 합니다.
      // 여기서는 axios 호출 로직만 구현합니다.
      await axios.post(config.url, JSON.stringify(payload), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, // Slack specific
      });
      
      setStatus('SUCCESS');
      setTimeout(() => setStatus('IDLE'), 3000);
    } catch (error) {
      console.error('Webhook Error:', error);
      setStatus('ERROR');
      setTimeout(() => setStatus('IDLE'), 3000);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🔔 메신저 연동 설정
      </h2>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slack / Teams Webhook URL
          </label>
          <input
            type="text"
            value={config.url}
            onChange={(e) => setConfig({ ...config, url: e.target.value })}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="isActive"
              type="checkbox"
              checked={config.isActive}
              onChange={(e) => setConfig({ ...config, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              알림 기능 활성화
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={status === 'LOADING'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                status === 'SUCCESS' 
                  ? 'bg-green-100 text-green-700' 
                  : status === 'ERROR'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'LOADING' ? '전송 중...' : status === 'SUCCESS' ? '성공!' : status === 'ERROR' ? '실패' : '테스트 발송'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WebhookSettings;
import os
import requests
import sys
from dotenv import load_dotenv

# [설계 3] 메신저 봇 웹훅 연동
# Team Comment: Secret 관리 보안 강화 -> 환경변수로 주입받음

def send_slack_notification(message: str):
    webhook_url = os.getenv("SLACK_WEBHOOK_URL")
    
    if not webhook_url:
        print("[Error] SLACK_WEBHOOK_URL is not set.")
        return

    payload = {
        "text": message,
        "username": "LunchBot",
        "icon_emoji": ":bento:"
    }

    try:
        response = requests.post(webhook_url, json=payload)
        response.raise_for_status()
        print("[Success] Slack notification sent.")
    except requests.exceptions.RequestException as e:
        print(f"[Error] Failed to send notification: {e}")

if __name__ == "__main__":
    # 외부 인자 또는 기본 메시지 처리
    msg = sys.argv[1] if len(sys.argv) > 1 else "오늘의 점심 추천 알림 서비스가 배포되었습니다! :rocket:"
    send_slack_notification(msg)
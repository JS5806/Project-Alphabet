FROM python:3.9-slim

WORKDIR /app

# 캐싱 효율을 위해 requirements 먼저 복사
COPY app/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스코드 복사
COPY app/ .

# 포트 노출
EXPOSE 8000

# 서버 실행
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
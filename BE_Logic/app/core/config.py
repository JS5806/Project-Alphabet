from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    GOOGLE_CLIENT_ID: str = "your-google-client-id" # 실제 구글 클라우드 콘솔 값 필요

    class Config:
        env_file = ".env"

settings = Settings()
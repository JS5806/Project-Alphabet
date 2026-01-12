from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.schemas.schemas import GoogleAuthRequest, Token
from app.models.models import User
from app.core.security import create_access_token
from app.core.config import settings
import httpx

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/google", response_model=Token)
async def google_login(request: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    """
    Google ID Token 검증 및 자체 JWT 발급
    (실제 운영 시에는 구글 공개키 검증 로직이 포함되어야 합니다. 여기선 간단히 이메일 추출 가정)
    """
    email = ""
    
    # [Google Token Verification Logic]
    # 실제로는 Google API를 호출하거나 google-auth 라이브러리로 서명 검증 수행
    # 데모를 위해 client_id 검증 로직으로 대체하거나 모의 처리
    try:
        async with httpx.AsyncClient() as client:
            # 구글의 token info endpoint 사용 (디버깅용, 프로덕션은 라이브러리 검증 권장)
            resp = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={request.id_token}")
            if resp.status_code != 200:
                # 개발용: 토큰이 "dev_token"이면 테스트 계정으로 통과 (실제 배포시 제거)
                if request.id_token == "dev_token":
                    email = "testuser@company.com"
                else:
                    raise HTTPException(status_code=400, detail="Invalid Google Token")
            else:
                data = resp.json()
                # if data['aud'] != settings.GOOGLE_CLIENT_ID:
                #     raise HTTPException(status_code=400, detail="Invalid Client ID")
                email = data.get("email")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Auth Error: {str(e)}")

    # 사용자 조회 혹은 생성 (Upsert)
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(email=email)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # 내부 JWT 발급
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}
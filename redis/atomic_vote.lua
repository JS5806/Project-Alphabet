-- KEYS[1]: 세션의 투표 Set Key (예: "vote:session:1:users") - 중복 방지용
-- KEYS[2]: 세션의 식당별 득표수 Hash Key (예: "vote:session:1:counts") - 실시간 집계용
-- ARGV[1]: User ID
-- ARGV[2]: Restaurant ID

local session_users_key = KEYS[1]
local session_counts_key = KEYS[2]
local user_id = ARGV[1]
local restaurant_id = ARGV[2]

-- 1. 이미 투표했는지 확인 (Set에 User ID 존재 여부 체크)
if redis.call("SISMEMBER", session_users_key, user_id) == 1 then
    return -1 -- 이미 투표함 (Error Code)
end

-- 2. 투표 처리 (Atomic Operation)
-- 유저를 투표 완료 목록에 추가
redis.call("SADD", session_users_key, user_id)
-- 해당 식당의 득표수 증가 (ZINCRBY or HINCRBY)
redis.call("HINCRBY", session_counts_key, restaurant_id, 1)

return 1 -- 성공
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

# [Security] 민감한 변수 선언 (tfvars 또는 환경변수로 주입)
variable "db_password" {
  description = "Master password for the RDS database"
  type        = string
  sensitive   = true
}

variable "office_ip_cidr" {
  description = "CIDR block for office VPN/Network"
  type        = string
  default     = "203.0.113.0/24" # 예시 IP
}

# 1. VPC 및 네트워크 (간소화를 위해 Default VPC 데이터 소스 사용)
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# 2. Security Group: Allow List 관리
resource "aws_security_group" "db_sg" {
  name        = "lunch-vote-db-sg"
  description = "Allow inbound traffic from App and Office"
  vpc_id      = data.aws_vpc.default.id

  # 사내망에서의 직접 접근 허용 (DB 관리용)
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = [var.office_ip_cidr]
  }

  # (실제 운영 시에는 Application Server의 SG ID를 참조해야 함)
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # 내부 VPC 대역 예시
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 3. RDS PostgreSQL Instance
resource "aws_db_instance" "default" {
  identifier           = "lunch-vote-db"
  allocated_storage    = 20
  storage_type         = "gp3"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.micro" # MVP용 프리티어 가능 인스턴스
  username             = "adminuser"
  password             = var.db_password
  parameter_group_name = "default.postgres15"
  
  # [Security] 스토리지 암호화
  storage_encrypted    = true
  
  # 네트워크 설정
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  publicly_accessible    = false # 보안을 위해 외부 접근 차단
  skip_final_snapshot    = true  # 테스트용

  # [Team Comment 대응] 커넥션 풀링 고려
  # 실제로는 PgBouncer 등을 앞단에 두는 것이 좋으나, RDS 파라미터 튜닝도 필요할 수 있음
}

# 4. CloudWatch Alarm: DB Connection Monitoring
# 점심시간 스파이크 대비 커넥션 수 모니터링
resource "aws_cloudwatch_metric_alarm" "db_connections_high" {
  alarm_name          = "rds-high-connections"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "DatabaseConnections"
  namespace           = "AWS/RDS"
  period              = "60"
  statistic           = "Maximum"
  threshold           = "80" # 인스턴스 사양에 맞춰 설정 (t3.micro는 max conn이 낮음)
  
  dimensions = {
    DBInstanceIdentifier = aws_db_instance.default.id
  }

  alarm_description = "Alarm when DB connections exceed 80"
  alarm_actions     = [] # SNS Topic ARN 등을 연결하여 알림 발송
}
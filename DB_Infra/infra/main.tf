provider "aws" {
  region = "ap-northeast-2" # 서울 리전
}

# 1. VPC 구성
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "vote-vpc" }
}

# 2. 서브넷 (RDS를 위한 Private Subnet 그룹)
resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-northeast-2a"
  tags = { Name = "vote-private-a" }
}

resource "aws_subnet" "private_c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "ap-northeast-2c"
  tags = { Name = "vote-private-c" }
}

resource "aws_db_subnet_group" "rds_subnet_group" {
  name       = "vote-rds-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_c.id]
}

# 3. 보안 그룹 (Security Group)
resource "aws_security_group" "rds_sg" {
  name        = "vote-rds-sg"
  description = "Allow DB traffic"
  vpc_id      = aws_vpc.main.id

  # Inbound: 5432 Port (실제 배포 시에는 App 서버의 SG ID만 허용해야 함)
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"] # VPC 내부에서만 접근 허용
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4. RDS PostgreSQL 인스턴스
resource "aws_db_instance" "vote_db" {
  identifier           = "vote-db-instance"
  allocated_storage    = 20
  storage_type         = "gp2"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.micro" # 프리티어/MVP용 저렴한 인스턴스
  db_name              = "voting_db"
  username             = "adminuser"
  password             = "SecurePass123!" # 실제 사용 시 Secrets Manager 사용 권장
  
  db_subnet_group_name   = aws_db_subnet_group.rds_subnet_group.name
  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  
  skip_final_snapshot    = true
  publicly_accessible    = false
  multi_az               = false # MVP 단계: 비용 절감
}

output "rds_endpoint" {
  value = aws_db_instance.vote_db.endpoint
}
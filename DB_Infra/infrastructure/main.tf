# Terraform: AWS Production Infrastructure Setup
# [Team Comment] AWS RDS 및 ElastiCache 구성을 코드로 관리

provider "aws" {
  region = "ap-northeast-2"
}

# 1. VPC & Security Groups (생략: 기본 VPC 사용 가정 또는 별도 모듈화)

# 2. RDS (PostgreSQL)
resource "aws_db_instance" "voting_db" {
  identifier        = "voting-db-production"
  engine            = "postgres"
  engine_version    = "15.4"
  instance_class    = "db.t3.medium" # 트래픽 대비 적절한 인스턴스 선택
  allocated_storage = 20
  storage_type      = "gp3"
  
  db_name  = "voting_db"
  username = var.db_username
  password = var.db_password

  # Connection Pool 최적화를 위한 파라미터 그룹 설정 필요
  parameter_group_name = "default.postgres15"
  
  multi_az            = true # 고가용성 보장
  publicly_accessible = false
  skip_final_snapshot = true
}

# 3. ElastiCache (Redis)
resource "aws_elasticache_cluster" "voting_cache" {
  cluster_id           = "voting-cache"
  engine               = "redis"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  engine_version       = "7.0"
  port                 = 6379
}

# 4. EC2 (Application Server)
resource "aws_instance" "app_server" {
  ami           = "ami-0c9c942bd7bf113a2" # Ubuntu 22.04 LTS Example
  instance_type = "t3.medium"
  
  # User data to install Docker & Run container
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y docker.io
              # Pull image from ECR and run
              EOF
}
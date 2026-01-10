# Deployment & Operation Guide

## 1. CI/CD Pipeline
- **Tools**: GitHub Actions
- **Process**: Code Push -> Linting -> Unit Test (Jest) -> Docker Build -> AWS ECR Push -> K8s Deployment

## 2. Monitoring Strategy
- **Health Check**: `/health` endpoint monitors service availability.
- **Logs**: Winston logger sends JSON logs to ELK Stack.
- **Alerting**: Grafana triggers Slack alerts if backend latency > 500ms.

## 3. Maintenance Procedures
- **DB Backup**: Weekly automated snapshot via AWS RDS.
- **Recovery**: Use `terraform apply` to recreate infrastructure in case of disaster.

## 4. Error Handling
- All frontend errors are tracked via **Sentry**.
- Backend errors are categorized by Severity Levels (Critical, Warning, Info).
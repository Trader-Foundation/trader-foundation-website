#!/bin/bash
# ============================================================
# TF ELITE TERMINAL — AWS ECS/Fargate Deployment Script
# ============================================================
# Prerequisites:
#   - AWS CLI configured (aws configure)
#   - Docker installed
#   - ECR repository created
#
# Usage: ./deploy/aws-deploy.sh
# ============================================================

set -euo pipefail

# Configuration — update these for your environment
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-$(aws sts get-caller-identity --query Account --output text)}"
ECR_REPO_NAME="tf-elite-terminal"
ECS_CLUSTER="tf-elite-cluster"
ECS_SERVICE="tf-elite-service"
ECS_TASK_FAMILY="tf-elite-task"
IMAGE_TAG="${IMAGE_TAG:-latest}"

ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "╔══════════════════════════════════════════════════╗"
echo "║  TF ELITE TERMINAL — AWS DEPLOYMENT             ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Step 1: Create ECR repository if it doesn't exist
echo "▸ Step 1: Ensuring ECR repository exists..."
aws ecr describe-repositories --repository-names "${ECR_REPO_NAME}" --region "${AWS_REGION}" 2>/dev/null || \
  aws ecr create-repository --repository-name "${ECR_REPO_NAME}" --region "${AWS_REGION}"

# Step 2: Login to ECR
echo "▸ Step 2: Logging into ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | \
  docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Step 3: Build Docker image
echo "▸ Step 3: Building Docker image..."
docker build -t "${ECR_REPO_NAME}:${IMAGE_TAG}" .

# Step 4: Tag and push to ECR
echo "▸ Step 4: Pushing to ECR..."
docker tag "${ECR_REPO_NAME}:${IMAGE_TAG}" "${ECR_URI}:${IMAGE_TAG}"
docker push "${ECR_URI}:${IMAGE_TAG}"

# Step 5: Create ECS cluster if it doesn't exist
echo "▸ Step 5: Ensuring ECS cluster exists..."
aws ecs describe-clusters --clusters "${ECS_CLUSTER}" --region "${AWS_REGION}" 2>/dev/null | \
  grep -q "ACTIVE" || \
  aws ecs create-cluster --cluster-name "${ECS_CLUSTER}" --region "${AWS_REGION}"

# Step 6: Register task definition
echo "▸ Step 6: Registering task definition..."
cat > /tmp/task-def.json << EOF
{
  "family": "${ECS_TASK_FAMILY}",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::${AWS_ACCOUNT_ID}:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "tf-elite-terminal",
      "image": "${ECR_URI}:${IMAGE_TAG}",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "3000"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/${ECS_TASK_FAMILY}",
          "awslogs-region": "${AWS_REGION}",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1"],
        "interval": 30,
        "timeout": 10,
        "retries": 3,
        "startPeriod": 10
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file:///tmp/task-def.json --region "${AWS_REGION}"

# Step 7: Update or create service
echo "▸ Step 7: Updating ECS service..."
aws ecs describe-services --cluster "${ECS_CLUSTER}" --services "${ECS_SERVICE}" --region "${AWS_REGION}" 2>/dev/null | \
  grep -q "ACTIVE" && \
  aws ecs update-service \
    --cluster "${ECS_CLUSTER}" \
    --service "${ECS_SERVICE}" \
    --task-definition "${ECS_TASK_FAMILY}" \
    --force-new-deployment \
    --region "${AWS_REGION}" || \
  echo "⚠ Service not found. Create it via AWS Console or CLI with your VPC/subnet/security group config."

echo ""
echo "✅ Deployment complete!"
echo "   Image: ${ECR_URI}:${IMAGE_TAG}"
echo "   Cluster: ${ECS_CLUSTER}"
echo "   Service: ${ECS_SERVICE}"

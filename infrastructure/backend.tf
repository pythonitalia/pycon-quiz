resource "aws_elastic_beanstalk_application" "app" {
  name        = "pyconquiz"
  description = "pyconquiz"
}

data "aws_db_instance" "database" {
  db_instance_identifier = "pythonit-production"
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.default.id

  tags = {
    Type = "public"
  }
}


resource "aws_elastic_beanstalk_environment" "main" {
  name                = "backend"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2018.03 v2.26.0 running Multi-container Docker 19.03.13-ce (Generic)"
  tier                = "WebServer"

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = aws_security_group.backend.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = data.aws_vpc.default.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = tolist(data.aws_subnet_ids.public.ids)[0]
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = tolist(data.aws_subnet_ids.public.ids)[0]
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.pyconquiz.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  setting {
    namespace = "aws:ec2:instances"
    name      = "InstanceTypes"
    value     = "t2.micro"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SECRET_KEY"
    value     = var.secret_key
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DATABASE_URL"
    value     = "postgresql://${data.aws_db_instance.database.master_username}:${var.database_password}@${data.aws_db_instance.database.address}:${data.aws_db_instance.database.port}/quiz"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "REDIS_URL"
    value     = "redis://${aws_elasticache_cluster.redis.cache_nodes.0.address}"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_STORAGE_BUCKET_NAME"
    value     = aws_s3_bucket.backend_media.id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "SENTRY_DNS"
    value     = var.backend_sentry_dsn
  }
}

output "app_domain" {
  value = aws_elastic_beanstalk_environment.main.cname
}

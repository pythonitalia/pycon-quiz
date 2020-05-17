resource "aws_elastic_beanstalk_application" "app" {
  name        = "pyconquiz"
  description = "pyconquiz"
}

resource "aws_elastic_beanstalk_environment" "main" {
  name                = "backend"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2018.03 v2.20.2 running Multi-container Docker 19.03.6-ce (Generic)"
  tier                = "WebServer"

  depends_on = [
    aws_internet_gateway.default
  ]

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
    value     = aws_vpc.default.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "ELBSubnets"
    value     = aws_subnet.primary.id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = aws_subnet.primary.id
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
    value     = "psql://postgres:1gOzLfJDxy4btDzZBo19@test-database.cmakkcpvxi7i.eu-west-1.rds.amazonaws.com/testdatabase"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "REDIS_URL"
    value     = "redis://${aws_elasticache_cluster.redis.cache_nodes.0.address}"
  }
}

output "app_domain" {
  value = "${aws_elastic_beanstalk_environment.main.cname}"
}

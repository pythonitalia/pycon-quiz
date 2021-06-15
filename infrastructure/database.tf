data "aws_db_subnet_group" "rds" {
  name = "pythonit-rds-subnet"
}

data "aws_security_group" "rds" {
  name = "pythonit-rds-security-group"
}

resource "random_password" "db_password" {
  length  = 65
  special = false
}

resource "aws_db_instance" "database" {
  allocated_storage           = 10
  storage_type                = "gp2"
  engine                      = "postgres"
  identifier                  = "pyfest-pubquiz"
  allow_major_version_upgrade = true
  engine_version              = "11.10"
  instance_class              = "db.t3.large"
  name                        = "pyconquiz"
  username                    = "root"
  password                    = random_password.db_password.result
  multi_az                    = "false"
  availability_zone           = "eu-central-1a"
  skip_final_snapshot         = true
  publicly_accessible         = false
  apply_immediately           = true
  backup_retention_period     = 1

  db_subnet_group_name   = data.aws_db_subnet_group.rds.name
  vpc_security_group_ids = [data.aws_security_group.rds.id]
}

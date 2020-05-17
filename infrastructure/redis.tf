resource "aws_elasticache_subnet_group" "default" {
  name       = "pyconquiz-subnet-group"
  subnet_ids = [aws_subnet.primary.id, aws_subnet.secondary.id]
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "backend"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis5.0"
  engine_version       = "5.0.6"
  port                 = 6379
  apply_immediately    = true
  subnet_group_name    = aws_elasticache_subnet_group.default.name
  security_group_ids = [
    aws_security_group.backend.id
  ]
}

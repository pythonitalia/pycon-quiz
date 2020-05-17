resource "aws_security_group" "backend" {
  vpc_id      = aws_vpc.default.id
  name        = "pyconquiz_backend"
  description = "pycon quiz"
}

resource "aws_security_group_rule" "allow_redis" {
  type                     = "ingress"
  from_port                = 6379
  to_port                  = 6379
  protocol                 = "tcp"
  security_group_id        = "${aws_security_group.backend.id}"
  source_security_group_id = "${aws_security_group.backend.id}"
}

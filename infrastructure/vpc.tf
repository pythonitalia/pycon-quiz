resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "pyconquiz"
  }
}

resource "aws_subnet" "primary" {
  vpc_id                  = aws_vpc.default.id
  availability_zone       = "eu-west-1a"
  cidr_block              = "10.0.4.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "pyconquiz-subnet-primary"
  }
}

resource "aws_subnet" "secondary" {
  vpc_id                  = aws_vpc.default.id
  availability_zone       = "eu-west-1b"
  cidr_block              = "10.0.5.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "pyconquiz-subnet-secondary"
  }
}

resource "aws_internet_gateway" "default" {
  vpc_id = aws_vpc.default.id

  tags = {
    Name = "pyconquiz-internet-gateway"
  }
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.default.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.default.id
}

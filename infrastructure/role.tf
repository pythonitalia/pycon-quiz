data "aws_iam_policy" "WebTier" {
  arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

data "aws_iam_policy" "MulticontainerDocker" {
  arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}

data "aws_iam_policy" "WorkerTier" {
  arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

resource "aws_iam_role" "pyconquiz" {
  name               = "pyconquiz-beanstalk-ec2-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_instance_profile" "pyconquiz" {
  name = "pyconquiz-beanstalk-ec2-user"
  role = aws_iam_role.pyconquiz.name
}


resource "aws_iam_role_policy" "pyconquiz" {
  name   = "pyconquiz-policy"
  role   = aws_iam_role.pyconquiz.id
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "cloudwatch:PutMetricData",
        "ds:CreateComputer",
        "ds:DescribeDirectories",
        "ec2:DescribeInstanceStatus",
        "s3:*",
        "elasticbeanstalk:*",
        "ecr:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "attach_webtier_policy" {
  role       = aws_iam_role.pyconquiz.id
  policy_arn = data.aws_iam_policy.WebTier.arn
}

resource "aws_iam_role_policy_attachment" "attach_worker_policy" {
  role       = aws_iam_role.pyconquiz.id
  policy_arn = data.aws_iam_policy.WorkerTier.arn
}

resource "aws_iam_role_policy_attachment" "attach_multicontainer_policy" {
  role       = aws_iam_role.pyconquiz.id
  policy_arn = data.aws_iam_policy.MulticontainerDocker.arn
}

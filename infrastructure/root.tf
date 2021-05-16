terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "3.29.0"
    }
  }

  backend "s3" {
    bucket = "pythonit-pyconquiz-terraform"
    key    = "terraform.tfstate"
    region = "eu-central-1"
  }
}

provider "aws" {
  region = "eu-central-1"
}

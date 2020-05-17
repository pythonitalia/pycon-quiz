terraform {
  backend "s3" {
    bucket  = "pyconquiz-terraform"
    key     = "terraform.tfstate"
    region  = "eu-west-1"
    profile = "default"
  }
}

provider "aws" {
  region  = "eu-west-1"
  profile = "default"
}

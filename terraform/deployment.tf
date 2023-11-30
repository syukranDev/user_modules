provider "aws" {
  region = "ap-southeast-2"
}

resource "aws_instance" "my_new_instance_nov23" {
  ami           = "<YOUR AMI ID GOES HERE>"
  instance_type = "<YOUR INSTANCE TYPE GOES HERE>"
  key_name      = "<YOUR KEYPAIR NAME GOES HERE>"

  tags = {
    Name = "nodejsAPP_NOV2023"
  }
}

resource "null_resource" "install_nodejs" {
  provisioner "remote-exec" {
    inline = [
      "sudo yum update -y",
      "sudo yum install -y git",
      "git clone https://github.com/syukranDev/user_modules.git",
      "curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -",
      "sudo yum install -y nodejs",
      "cd user_modules",
      "npm install",
      "npm run dev"
    ]

    connection {
      type        = "ssh"
      user        = "ec2-user"
      private_key = file("path/to/your/private/key.pem")
      host        = "<YOUR IP GOES HERE OR PUT aws_instance.my_new_instance_nov23.public_ip >"
    }
  }

  depends_on = [aws_instance.install_nodejs]
}


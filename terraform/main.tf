provider "aws" {
  region = "us-east-1"
}

# 1. Seguridad (Firewall)
resource "aws_security_group" "fcore_sg" {
  name        = "fcore-production-sg"
  description = "Security Group for FCORE"

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend (Next.js)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend (FastAPI)
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Salida permitida a todo
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. Llaves SSH
resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = "fcore-deploy-key"
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "${path.module}/fcore-deploy-key.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

# 3. Servidor EC2 (Low Cost con SWAP)
resource "aws_instance" "fcore_server" {
  ami           = "ami-04b70fa74e45c3917" # Ubuntu 24.04 LTS us-east-1
  instance_type = "t3.micro"             # Free Tier eligible
  key_name      = aws_key_pair.kp.key_name
  security_groups = [aws_security_group.fcore_sg.name]

  # Disco de 15GB para aguantar el Swap y las imágenes Docker
  root_block_device {
    volume_size = 15
    volume_type = "gp3"
  }

  # Script mágico: Instala Docker y configura Memoria Virtual (Swap)
  user_data = <<-EOF
              #!/bin/bash
              
              # --- Configurar SWAP (2GB) ---
              fallocate -l 2G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile none swap sw 0 0' >> /etc/fstab
              sysctl vm.swappiness=10
              echo 'vm.swappiness=10' >> /etc/sysctl.conf

              # --- Instalar Docker ---
              apt-get update
              apt-get install -y ca-certificates curl gnupg
              install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              chmod a+r /etc/apt/keyrings/docker.gpg
              echo \
                "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
                "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
                tee /etc/apt/sources.list.d/docker.list > /dev/null
              apt-get update
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
              usermod -aG docker ubuntu
              EOF

  tags = {
    Name = "FCORE-Production-Server"
  }
}

output "public_ip" {
  value = aws_instance.fcore_server.public_ip
}
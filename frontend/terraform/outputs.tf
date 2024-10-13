output "vpc_id" {
  description = "The ID of the VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "The IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "The IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "web_instance_public_ips" {
  description = "The public IP addresses of the web instances"
  value       = aws_instance.web[*].public_ip
}

output "db_endpoint" {
  description = "The endpoint of the RDS instance"
  value       = aws_db_instance.main.endpoint
}

output "db_username" {
  description = "The master username for the RDS instance"
  value       = aws_db_instance.main.username
}

output "db_password" {
  description = "The master password for the RDS instance"
  value       = random_password.db_password.result
  sensitive   = true
}
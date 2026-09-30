#!/usr/bin/env bash
# =============================================================================
# ARIS — EC2 One-Time Server Setup Script
# Run this ONCE on a fresh Ubuntu 24.04 EC2 instance.
# Usage: bash ec2-setup.sh
# =============================================================================

set -euo pipefail

echo "========================================"
echo "  ARIS EC2 Server Setup"
echo "========================================"

# ── 1. System update ─────────────────────────────────────────────────────────
echo "[1/8] Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# ── 2. Install Docker ────────────────────────────────────────────────────────
echo "[2/8] Installing Docker..."
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"

# ── 3. Install Docker Compose plugin ────────────────────────────────────────
echo "[3/8] Installing Docker Compose plugin..."
sudo apt-get install -y docker-compose-plugin

# ── 4. Install Nginx ─────────────────────────────────────────────────────────
echo "[4/8] Installing Nginx..."
sudo apt-get install -y nginx
sudo systemctl enable nginx

# ── 5. Create application directory ──────────────────────────────────────────
echo "[5/8] Creating /opt/aris directory..."
sudo mkdir -p /opt/aris
sudo chown "$USER":"$USER" /opt/aris

# ── 6. Configure Nginx ───────────────────────────────────────────────────────
echo "[6/8] Configuring Nginx..."
# You will SCP the default.conf from docker/nginx/default.conf after setup
# sudo cp /tmp/default.conf /etc/nginx/sites-available/aris
# sudo ln -s /etc/nginx/sites-available/aris /etc/nginx/sites-enabled/aris
# sudo rm -f /etc/nginx/sites-enabled/default
# sudo nginx -t && sudo systemctl reload nginx
echo "  → Copy docker/nginx/default.conf to /etc/nginx/sites-available/aris manually."

# ── 7. Install Certbot (HTTPS) ────────────────────────────────────────────────
echo "[7/8] Installing Certbot..."
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot
echo "  → After DNS is ready, run: sudo certbot --nginx -d yourdomain.com"

# ── 8. Configure UFW Firewall ─────────────────────────────────────────────────
echo "[8/8] Configuring UFW firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
# IMPORTANT: Do NOT open 3000 or 8000 — only Nginx should be public
sudo ufw --force enable

echo ""
echo "========================================"
echo "  ✅ EC2 Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Log out and back in so Docker group takes effect"
echo "  2. SCP your .env file:  scp .env.production ubuntu@EC2_IP:/opt/aris/.env"
echo "  3. SCP docker-compose:  scp docker-compose.yml ubuntu@EC2_IP:/opt/aris/"
echo "  4. SCP nginx config:    scp docker/nginx/default.conf ubuntu@EC2_IP:/tmp/"
echo "  5. On EC2:              sudo cp /tmp/default.conf /etc/nginx/sites-available/aris"
echo "                          sudo ln -s /etc/nginx/sites-available/aris /etc/nginx/sites-enabled/"
echo "                          sudo rm /etc/nginx/sites-enabled/default"
echo "                          sudo nginx -t && sudo systemctl reload nginx"
echo "  6. Run certbot:         sudo certbot --nginx -d yourdomain.com"
echo "  7. Push to main branch → GitHub Actions will deploy automatically"
echo ""

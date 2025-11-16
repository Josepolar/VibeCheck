#!/bin/bash
# VibeCheck API Test Script
# Tests all main API endpoints

API_URL="http://localhost:3001/api"

echo "🎯 VibeCheck API Test Script"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test health endpoint
echo "Testing health endpoint..."
HEALTH=$(curl -s "$API_URL/health")
if echo "$HEALTH" | grep -q "ok"; then
    echo -e "${GREEN}✓ Health check passed${NC}"
else
    echo -e "${RED}✗ Health check failed${NC}"
    exit 1
fi
echo ""

# Test user registration
echo "Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser$(date +%s)\",\"email\":\"test$(date +%s)@example.com\",\"password\":\"test123\"}")

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ User registration passed${NC}"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗ User registration failed${NC}"
    echo "$REGISTER_RESPONSE"
    exit 1
fi
echo ""

# Test goal creation
echo "Testing goal creation..."
GOAL_RESPONSE=$(curl -s -X POST "$API_URL/goals" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test Goal","description":"Testing the API","category":"health","is_public":true}')

if echo "$GOAL_RESPONSE" | grep -q "Goal created successfully"; then
    echo -e "${GREEN}✓ Goal creation passed${NC}"
    GOAL_ID=$(echo "$GOAL_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
else
    echo -e "${RED}✗ Goal creation failed${NC}"
    echo "$GOAL_RESPONSE"
    exit 1
fi
echo ""

# Test fetching goals
echo "Testing goal retrieval..."
GOALS=$(curl -s -X GET "$API_URL/goals" \
  -H "Authorization: Bearer $TOKEN")

if echo "$GOALS" | grep -q "Test Goal"; then
    echo -e "${GREEN}✓ Goal retrieval passed${NC}"
else
    echo -e "${RED}✗ Goal retrieval failed${NC}"
    exit 1
fi
echo ""

# Test mood check-in
echo "Testing mood check-in..."
MOOD_RESPONSE=$(curl -s -X POST "$API_URL/mood" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"mood":"happy","note":"Testing mood"}')

if echo "$MOOD_RESPONSE" | grep -q "Mood check-in recorded"; then
    echo -e "${GREEN}✓ Mood check-in passed${NC}"
else
    echo -e "${RED}✗ Mood check-in failed${NC}"
    exit 1
fi
echo ""

# Test community message
echo "Testing community message..."
COMMUNITY_RESPONSE=$(curl -s -X POST "$API_URL/community/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"message":"Test support message","category":"support"}')

if echo "$COMMUNITY_RESPONSE" | grep -q "Message posted successfully"; then
    echo -e "${GREEN}✓ Community message passed${NC}"
else
    echo -e "${RED}✗ Community message failed${NC}"
    exit 1
fi
echo ""

echo "=============================="
echo -e "${GREEN}✓ All tests passed!${NC}"
echo "=============================="

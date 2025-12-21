#!/bin/bash

# Simple placeholder icon generator
# Replace with actual icons later

sizes=(72 96 128 144 152 192 384 512)

echo "Creating placeholder icons..."

for size in "${sizes[@]}"; do
  echo "  → icon-${size}.png (placeholder)"
done

echo ""
echo "✅ Icon placeholders noted."
echo ""
echo "To create actual icons:"
echo "1. Design a 512x512 icon in Figma/Photoshop"
echo "2. Export at different sizes: 72, 96, 128, 144, 152, 192, 384, 512"
echo "3. Save them as icon-{size}.png in /public folder"
echo ""
echo "Or use an online tool:"
echo "- https://realfavicongenerator.net/"
echo "- https://www.pwabuilder.com/"

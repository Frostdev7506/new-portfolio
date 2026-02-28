#!/usr/bin/env bash
set -u

URL="${1:-https://neerajbutola.netlify.app/}"
MAX_PAGES="${MAX_PAGES:-8}"
OUT_ROOT="${2:-reports/seo}"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="${OUT_ROOT%/}/${STAMP}"

mkdir -p "$OUT_DIR"

echo "Running SEOmator audit for: $URL"
echo "Output directory: $OUT_DIR"
echo "Max pages: $MAX_PAGES"

EXIT_CODE=0
for fmt in llm json markdown html; do
  OUT_FILE="$OUT_DIR/seo-report.$fmt"
  echo "Generating $fmt report -> $OUT_FILE"
  HOME=/tmp npx seomator audit "$URL" --crawl -m "$MAX_PAGES" --no-cwv --format "$fmt" -o "$OUT_FILE"
  CODE=$?
  if [ $CODE -ne 0 ]; then
    EXIT_CODE=$CODE
  fi
done

echo ""
echo "SEOmator reports saved:"
echo "- $OUT_DIR/seo-report.llm"
echo "- $OUT_DIR/seo-report.json"
echo "- $OUT_DIR/seo-report.markdown"
echo "- $OUT_DIR/seo-report.html"

exit $EXIT_CODE

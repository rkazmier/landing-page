#!/usr/bin/env bash
# Tworzy GitHub Issues z plików Z*.md. Wymaga zalogowanego gh (gh auth login).
# Uruchom raz; ponowne uruchomienie utworzy duplikaty.
set -euo pipefail
cd "$(dirname "$0")"
for f in Z*.md; do
  title=$(head -n1 "$f" | sed 's/^# //')
  body=$(tail -n +2 "$f")
  url=$(gh issue create --repo rkazmier/landing-page --title "$title" --body "$body")
  echo "$f -> $url"
done

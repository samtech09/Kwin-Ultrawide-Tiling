#!/usr/bin/env sh
yell() { echo "$0: $*" >&2; }
die() { yell "$*"; exit 111; }
try() { "$@" || die "cannot $*"; }

[ -z "$1" ] && die 'Usage: release.sh <version_tag> [<commit_to_tag>]'

# Create .kwinscript release artifact
RELEASE_ARTIFACT="Ultrawide-Tiling.kwinscript"
[ -e $RELEASE_ARTIFACT ] && try rm -vf $RELEASE_ARTIFACT
try zip -9 $RELEASE_ARTIFACT \
  metadata.desktop\
  contents \
  LICENSE

echo "Creating git tag '$1'..."
try git tag "$1" "${2:-HEAD}"
echo "Pushing tag to Github..."
try git push github "$1"
echo "Creating Github release..."
try hub release create --edit --draft --open "$1" --attach "$RELEASE_ARTIFACT"

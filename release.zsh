#!/usr/bin/env zsh
yell() { echo "$*" >&2; }
die() { yell "$*"; exit 111; }
try() { "$@" || die "cannot $*"; }

# Process args
[[ "$1" == "-h" ]] && die 'Usage: release.zsh [<commit_to_tag> <version_tag>]'
version_tag="${2:-$(awk -F'=' '/X-KDE-PluginInfo-Version/ {print $2}' metadata.desktop)}"
commit="${1:-HEAD}"

read -sq "?Create release ${version_tag} at git ref ${commit}? [y/n] " || die "Aborted." && echo

# Create .kwinscript release artifact
release_artifact="Ultrawide-Tiling-${version_tag}.kwinscript"
[ -e $release_artifact ] && try rm -vf $release_artifact
try zip -9 $release_artifact \
  metadata.desktop\
  contents \
  LICENSE

yell "Creating git tag '${version_tag}'..."
try git tag "$version_tag" "$commit"
yell "Pushing tag to Github..."
try git push github "$version_tag"
echo "Creating Github release..."
try hub release create --edit --draft --browse --attach "$release_artifact" "$version_tag"

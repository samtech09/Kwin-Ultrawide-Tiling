# Ultrawide-Tiling (kwinscript for KDE/Plasma)

This KWin script provides a set of shortcuts for easily "tiling" windows in halves, thirds, or sixths.
This is useful especially for ultrawide monitors.

## Installation

To install, download the `Ultrawide-Tiling.kwinscript` artifact from the [releases page](https://github.com/zhimsel/Kwin-Ultrawide-Tiling/releases) and run:

```bash
plasmapkg2 --type kwinscript -i /path/to/Ultrawide-Tiling.kwinscript
```

To update the kwinscript to a new version

```bash
plasmapkg2 --type kwinscript -u /path/to/Ultrawide-Tiling.kwinscript
```

To uninstall: 

```bash
plasmapkg2 --type kwinscript -r Ultrawide-Tiling
```

### From source

You can also clone this repo and use the above commands to install/update by pointing `plasmapkg2` to the repo directory instead of the `.kwinscript` file.

## Usage

Once installed, make sure the script is selected in the "Kwin Scripts" settings panel and restart your KDE/Plasma session.
You should now see a set of keyboard shortcuts in the "Kwin" Global Shortcuts panel.
Set them to what you'd like and apply!

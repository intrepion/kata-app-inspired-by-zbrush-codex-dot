# ZBrush inspiration research

Checked 2026-11-10 using official primary sources.

- [Maxon: Sculpting Brushes](https://help.maxon.net/zbr/en-us/Content/html/user-guide/3d-modeling/sculpting/sculpting-brushes/sculpting-brushes.html) explains brush-driven vertex displacement. Claywell implements a small version with local vertex-normal displacement and a radial falloff, plus inverse displacement and Laplacian smoothing.
- [Maxon: Symmetry](https://help.maxon.net/zbr/en-us/Content/html/user-guide/3d-modeling/sculpting/symmetry/symmetry.html) explains axis symmetry. Claywell reflects the world-space brush center across X; it does not implement poseable or radial symmetry.
- [Maxon: Interface & Navigation](https://help.maxon.net/zbr/en-us/Content/html/zbrushcore/interface-navigation/interface-navigation.html) describes draw mode, brush selection, symmetry and undo/redo. Claywell adopts this general creative loop with an original, simpler layout and keyboard controls.

Claywell has an original earthy visual identity, procedurally created starter geometry, and no Maxon/ZBrush logos, code, screenshots, trademarks as product branding, or borrowed asset files. It is an independent learning kata, not a compatible or affiliated ZBrush product.

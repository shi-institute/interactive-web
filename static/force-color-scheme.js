/**
 * @param {CSSRuleList} rule
 * @returns {cssRules is CSSMediaRule}
 */
function isCSSMediaRule(cssRules) {
  return cssRules && cssRules.media;
}

/**
 * @param {'light' | 'dark' | 'auto' | undefined} mode
 * @param {Window} [_window]
 */
function forceColorScheme(mode, _window = window) {
  if (!_window.matchMedia) return;

  if (!mode) {
    mode = localStorage.getItem('theme') || 'auto';
  }
  if (!mode) return;

  const prefersColorSchemeRules = Array.from(_window.document.styleSheets)
    .flatMap((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules);
      } catch (e) {
        return [];
      }
    })
    .filter(isCSSMediaRule)
    .filter((rule) => rule.media.mediaText.includes('prefers-color-scheme'))
    .map((rule) => rule.media);

  if (!prefersColorSchemeRules.length) return;

  prefersColorSchemeRules.forEach((media) => {
    const containsLight = media.mediaText.includes('(prefers-color-scheme: light)');
    const containsDark = media.mediaText.includes('(prefers-color-scheme: dark)');
    const containsOriginalLight = media.mediaText.includes(
      '(original-prefers-color-scheme: light)'
    );
    const containsOriginalDark = media.mediaText.includes('(original-prefers-color-scheme: dark)');

    // Step 1: Store original media queries if not already tracked
    if (!containsOriginalLight && !containsOriginalDark) {
      if (containsLight) {
        media.appendMedium('(original-prefers-color-scheme: light)');
      }
      if (containsDark) {
        media.appendMedium('(original-prefers-color-scheme: dark)');
      }
    }

    // Step 2: Apply theme overrides
    switch (mode) {
      case 'light':
        // remove current media queries
        if (containsLight) media.deleteMedium('(prefers-color-scheme: light)');
        if (containsDark) media.deleteMedium('(prefers-color-scheme: dark)');

        // make the light theme active
        if (containsOriginalLight) {
          media.appendMedium('(prefers-color-scheme: light)');
          media.appendMedium('(prefers-color-scheme: dark)');
        }

        break;
      case 'dark':
        // remove current media queries
        if (containsLight) media.deleteMedium('(prefers-color-scheme: light)');
        if (containsDark) media.deleteMedium('(prefers-color-scheme: dark)');

        // make the light theme active
        if (containsOriginalDark) {
          media.appendMedium('(prefers-color-scheme: light)');
          media.appendMedium('(prefers-color-scheme: dark)');
        }

        break;
      case 'auto':
        // remove current media queries
        if (containsLight) media.deleteMedium('(prefers-color-scheme: light)');
        if (containsDark) media.deleteMedium('(prefers-color-scheme: dark)');

        // restore the original media queries
        if (containsOriginalLight) media.appendMedium('(prefers-color-scheme: light)');
        if (containsOriginalDark) media.appendMedium('(prefers-color-scheme: dark)');

        break;
    }
  });

  // force reflow to ensure styles apply correctly
  _window.document.documentElement.style.display = 'none';
  _window.requestAnimationFrame(() => {
    _window.document.documentElement.style.display = '';
  });
}

if (window) {
  window.forceColorScheme = forceColorScheme;
}

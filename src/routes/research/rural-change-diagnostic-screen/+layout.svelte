<script lang="ts">
  import { afterNavigate, goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let prefersDarkMode = false;
  onMount(() => {
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)');
    if (darkModePreference.matches) prefersDarkMode = true;
    else prefersDarkMode = false;

    const listener = (e: MediaQueryListEvent) => {
      if (e.matches) prefersDarkMode = true;
      else prefersDarkMode = false;
    };

    darkModePreference.addEventListener('change', listener);

    return () => {
      darkModePreference.removeEventListener('change', listener);
    };
  });

  function handleClick(evt: MouseEvent & { target?: HTMLAnchorElement }) {
    evt.preventDefault();
    goto(evt.target?.href);
  }

  /**
   * Marks the active tab in the menu based on the current route
   */
  async function updateActiveTab() {
    // wait for the custom element to be defined
    await customElements.whenDefined('calcite-menu-item');

    // get all menu items
    const menuItems = document.querySelectorAll('calcite-menu-item');

    // wait for every menu item to render so we can access the shadow DOM
    // @ts-expect-error componentOnReady() is a special function provided by esri/calcite-components
    await Promise.all(Array.from(menuItems).map((menuItem) => menuItem.componentOnReady()));

    // check if the current route matches the href of the menu item
    // and set the active property accordingly
    menuItems.forEach((menuItem) => {
      const anchor = menuItem.shadowRoot?.querySelector('a');
      const href = anchor?.getAttribute('href');
      if (href && $page.url.pathname.startsWith(href)) {
        // @ts-expect-error active is a property of calcite-menu-item
        menuItem.active = true;
      } else {
        // @ts-expect-error active is a property of calcite-menu-item
        menuItem.active = false;
      }
    });
  }
  onMount(() => {
    customElements.whenDefined('calcite-menu-item').then(updateActiveTab);
  });
  afterNavigate(updateActiveTab);
</script>

<svelte:head>
  <script
    type="module"
    src="https://js.arcgis.com/calcite-components/2.11.1/calcite.esm.js"
  ></script>
  <link
    rel="stylesheet"
    type="text/css"
    href="https://js.arcgis.com/calcite-components/2.11.1/calcite.css"
  />
</svelte:head>

<calcite-shell class="calcite-mode-auto">
  <calcite-navigation slot="header">
    <calcite-navigation-logo
      id="header-title"
      slot="logo"
      heading="Rural change diagnostic screening tool"
      href="/research/rural-change-diagnostic-screen"
    ></calcite-navigation-logo>
    <calcite-menu slot="content-end">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <calcite-menu-item
        text="Map"
        icon-start="map"
        text-enabled
        href="/research/rural-change-diagnostic-screen/map"
        on:click="{handleClick}"
      ></calcite-menu-item>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <calcite-menu-item
        text="Guide"
        icon-start="open-book"
        text-enabled
        href="/research/rural-change-diagnostic-screen/guide"
        on:click="{handleClick}"
      ></calcite-menu-item>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <calcite-menu-item
        text="Brief"
        icon-start="article"
        text-enabled
        href="/research/rural-change-diagnostic-screen/brief"
        on:click="{handleClick}"
      ></calcite-menu-item>
    </calcite-menu>
  </calcite-navigation>
  <slot />
</calcite-shell>

<style>
  calcite-shell {
    position: relative;
    height: calc(100vh - var(--headerVisibleHeight));
  }

  calcite-navigation-logo {
    font-family: 'Abril Text', serif;
  }
</style>

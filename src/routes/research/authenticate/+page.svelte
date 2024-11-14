<script lang="ts">
  import { Button, ContentDialog, InfoBar, TextBlock, TextBox } from 'fluent-svelte';

  export let data;
  export let form;
</script>

<!-- <img
  src="https://www.furman.edu/shi-institute/wp-content/uploads/sites/182/2022/07/The-Shi-Institute-Wordmark-4C-512x146.png"
  alt=""
/> -->

<form method="POST">
  <ContentDialog
    open
    darken="{false}"
    closable="{false}"
    class="login-dialog-persistent"
    title="Sign in"
  >
    <div class="content-wrapper">
      <div class="content">
        <p>
          To continue to <TextBlock variant="bodyStrong">
            {data.appName || data.scopes[0]}
          </TextBlock>
        </p>

        {#if form?.incorrectPassword}
          <InfoBar
            closable="{false}"
            severity="critical"
            message="The provided password was incorrect."
          />
          <br />
        {/if}

        <div class="input" id="username-group">
          <TextBlock>Username</TextBlock>
          <TextBox name="username" value="{data.scopes[0]}" autocomplete="username" required />
        </div>

        <div class="input">
          <TextBlock>Password</TextBlock>
          <TextBox name="password" type="password" autocomplete="current-password" required />
        </div>

        <p class="access">
          Think you should have access to this page?
          <Button href="mailto:{data.requestEmail}" variant="hyperlink" class="unindent">
            Send us an email with your request.
          </Button>
        </p>
      </div>

      <div class="button-row">
        <Button variant="accent" type="submit">Continue</Button>
      </div>
    </div>
  </ContentDialog>
</form>

<style>
  .input {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-bottom: 10px;
  }

  :global(.content-dialog-smoke:has(.login-dialog-persistent)) {
    block-size: calc(100vh - var(--headerVisibleHeight)) !important;
    inset-block-start: var(--headerVisibleHeight) !important;
  }
  :global(.login-dialog-persistent .content-dialog-title) {
    white-space: pre-wrap;
  }

  .button-row {
    display: flex;
    flex-direction: row-reverse;
  }

  .access {
    margin-top: 1.25rem;
    opacity: 0.9;
  }
  .access :global(.unindent) {
    margin-left: -11px;
  }

  #username-group {
    display: none;
  }

  @media (max-width: 600px) {
    :global(.login-dialog-persistent) {
      width: 100%;
      height: calc(100vh - var(--headerVisibleHeight));
      inline-size: unset !important;
      max-inline-size: unset !important;
      border-radius: 0 !important;
      border: none !important;
    }
    :global(.login-dialog-persistent > .content-dialog-body) {
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
    .content-wrapper {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }
</style>

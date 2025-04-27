<script lang="ts">
  let text = '';
</script>

<textarea bind:value="{text}" placeholder="Enter text here..."></textarea>
<div class="status">
  <p>Character Count: {text.length}</p>
  <p>Word Count: {text.split(/\s+/).filter(Boolean).length}</p>
</div>

<style>
  div.status {
    display: flex;
    flex-direction: row;
    gap: 10px;
    font-size: 12px;
    height: 24px;
    align-items: center;
    border-top: 1px solid #ccc;
  }
  @media (prefers-color-scheme: dark) {
    div.status {
      border-top: 1px solid #333;
    }
  }

  p {
    margin: 0;
    padding-left: 10px;
  }

  textarea {
    width: 100%;
    height: calc(100vh - 24px);
    box-sizing: border-box;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 0;
    resize: none;
    font-family: inherit;
  }

  textarea:focus {
    outline: none;
  }
</style>

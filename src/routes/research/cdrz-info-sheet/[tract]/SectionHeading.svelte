<script lang="ts">
  export let noTopMargin = false;
</script>

<h2 class:noTopMargin="{noTopMargin}"><slot /></h2>

<style>
  h2 {
    font-size: 24px;
    font-family: 'Abril Text', serif;
    font-weight: 600;
    margin: 0;
    position: relative;
    padding-top: 10px;
    margin-top: 60px;
  }

  h2.noTopMargin {
    margin-top: 0;
  }

  h2::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 4px;
    width: 100px;
    background-color: tomato;
  }
</style>

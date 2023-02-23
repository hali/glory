<template>
  <footer class="footer has-cards">
    <div class="container container-lg">
      <div class="row align-items-center justify-content-md-between">
        <div class="col-md-6">
          <div class="copyright">
            &copy; {{ year }}
            <a
              href="https://rootcauseengineering.com"
              target="_blank"
              rel="noopener"
            >Root Cause Engineering</a>
          </div>
        </div>
        <div class="col-md-6">
          <ul class="nav nav-footer justify-content-end">
            <li class="nav-item">
              <a
                href="https://rootcauseengineering.com"
                class="nav-link"
                target="_blank"
                rel="noopener"
              >Root Cause Engineering</a>
            </li>
            <li class="nav-item">
              <a
                href="/manifest"
                class="nav-link"
                target="_blank"
                rel="noopener"
              >Манифест</a>
            </li>
            <li class="nav-item">
              <a
                href="http://blog.creative-tim.com"
                class="nav-link"
                target="_blank"
                rel="noopener"
              >Blog</a>
            </li>
            <li class="nav-item">
              <a
                href="https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md"
                class="nav-link"
                target="_blank"
                rel="noopener"
              >MIT License</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      year: new Date().getFullYear()
    }
  }
};
</script>
<style>
</style>

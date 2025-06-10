<template>
  <div id="app">
    <router-view name="header" />
    <router-view class="row3" />
    <router-view name="footer" />
  </div>
</template>

<style>
/* Fix for excessive spacing between header and content */
.header-global {
  margin-bottom: -80px !important;
  padding-bottom: 0 !important;
  position: relative;
  z-index: 100;
}

/* Adjust section padding to compensate for negative margin on header */
.section-shaped,
.section,
.section-lg {
  padding-top: 80px !important;
  position: relative;
  z-index: 1;
}

/* Make headings flush with the top of their containers */
.section-shaped .container h1.display-3,
.section .container h1.display-3 {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* Adjust card margins */
.card {
  margin-top: 8px !important;
}

/* Adjust shape background position */
.section-shaped .shape {
  position: absolute;
  top: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Reduce margins in rows */
.container .row:first-child {
  margin-top: 0 !important;
}

.row {
  margin-top: 0.25rem;
}

/* Ensure container has minimal padding */
.container {
  padding-top: 0 !important;
}

/* Fix utility classes */
.my-0 {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
</style>
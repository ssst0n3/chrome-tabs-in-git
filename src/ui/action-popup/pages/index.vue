<script setup lang="ts">
import RecordTabs from "src/ui/action-popup/pages/RecordTabs.vue"
import OpenTabs from "src/ui/action-popup/pages/OpenTabs.vue"
</script>

<template>
  <div>
    <div class="hero">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1>Hello there</h1>
          <div class="flex gap-2 justify-center mb-4">
            <OpenTabs />
            <RecordTabs />
          </div>

          <a
            class="btn btn-link"
            href="https://github.com/ssst0n3/chrome-tabs-in-git"
          >
            Documentation
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

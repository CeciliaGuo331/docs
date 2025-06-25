<script setup>
import { data as posts } from '../posts.data.mjs'
import { withBase } from 'vitepress'
</script>

<template>
  <div class="vp-features">
    <div class="container">
      <div class="items">
        <div class="item" v-for="post in posts" :key="post.url">
          <article class="vp-feature">
            <a :href="withBase(post.url)" class="feature-link">
              <h2 class="title">{{ post.title }}</h2>
              <p class="details">{{ post.details }}</p>
              <div class="link-text">
                <p class="link">{{ post.linkText }}</p>
              </div>
            </a>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-features {
  position: relative;
  padding: 0 24px;
}

@media (min-width: 640px) {
  .vp-features {
    padding: 0 48px;
  }
}

@media (min-width: 960px) {
  .vp-features {
    padding: 0 64px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  margin: -8px;
}

.item {
  padding: 8px;
  width: 100%;
}

@media (min-width: 640px) {
  .item {
    width: calc(100% / 2);
  }
}

@media (min-width: 960px) {
  .item {
    width: calc(100% / 3);
  }
}

.vp-feature {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  padding: 24px;
}

.vp-feature:hover {
  border-color: var(--vp-c-brand-1);
}

.feature-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.title {
  line-height: 24px;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.25s;
}

.details {
  padding-top: 8px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.link-text {
  padding-top: 16px;
}

.link {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}

.feature-link:hover .link {
  color: var(--vp-c-brand-2);
}
</style>

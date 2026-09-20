<template>
  <footer class="footer -mx-4 md:mx-0">
    <div class="container mx-auto px-4 py-8">
      <div class="grid md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <img :src="logo" alt="টেকভিউ" class="footer-logo" />
            <span class="footer-brand">টেকভিউ</span>
          </div>
          <p class="footer-copy">
            বাংলায় প্রযুক্তি শেখার নির্ভরযোগ্য ঠিকানা। ওয়েব ডেভেলপমেন্ট, প্রোগ্রামিং, এআই আর
            ডেভঅপস — সব সহজ বাংলায়।
          </p>
        </div>

        <div>
          <h4 class="footer-title">লিংক</h4>
          <ul class="footer-links">
            <li><nuxt-link to="/">হোম</nuxt-link></li>
            <li><nuxt-link to="/blog">ব্লগ</nuxt-link></li>
            <li v-for="page in pages" :key="page.slug">
              <nuxt-link :to="`/${page.slug}`">{{ page.title }}</nuxt-link>
            </li>
          </ul>
        </div>

        <div>
          <h4 class="footer-title">জনপ্রিয় বিষয়</h4>
          <ul class="footer-tags">
            <li v-for="tag in tags" :key="tag">
              <nuxt-link :to="`/blog?tag=${tag}`">{{ tag }}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom mt-8 pt-6">
        <p>© {{ year }} টেকভিউ — বাংলায় প্রযুক্তি</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import settings from '@/content/settings/general.json';

@Component
export default class Footer extends Vue {
  logo = settings.logo;

  year = new Date().getFullYear();

  get pages(): Page[] {
    return this.$store.state.pages;
  }

  get tags(): string[] {
    return (this.$store.state.tags || []).slice(0, 8);
  }
}
</script>

<style lang="scss">
.footer {
  background: $footer-bg;
  color: $footer-text;
  margin-top: auto;

  .footer-logo {
    width: 1.75rem;
    height: 1.75rem;
  }

  .footer-brand {
    font-weight: 700;
    color: #fff;
  }

  .footer-copy {
    color: $footer-muted;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  .footer-title {
    color: #fff;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .footer-links li a,
  .footer-tags li a {
    color: $footer-muted;
    font-size: 0.875rem;

    &:hover {
      color: #fff;
    }
  }

  .footer-links li {
    margin-bottom: 0.5rem;
  }

  .footer-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;

    li a {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.08);
      font-size: 0.75rem;

      &:hover {
        background: rgba(255, 255, 255, 0.16);
      }
    }
  }

  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    color: $footer-muted;
    font-size: 0.875rem;
    text-align: center;
  }
}
</style>

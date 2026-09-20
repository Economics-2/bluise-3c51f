<template>
  <header class="flex items-center py-4 md:py-6 page-header">
    <div class="header__logo">
      <nuxt-link to="/" class="flex items-center gap-3">
        <img :src="logo" alt="টেকভিউ" class="logo-img" />
        <span class="logo-word">টেকভিউ</span>
      </nuxt-link>
    </div>

    <nav class="nav ml-auto">
      <ul class="flex flex-row items-center sm:mt-4 sm:pt-4 md:mt-0 md:pt-0 md:mr-2 lg:mr-4">
        <li>
          <nuxt-link to="/" exact class="block font-medium px-4 py-1 md:p-2 lg:px-4">
            হোম
          </nuxt-link>
        </li>

        <li>
          <nuxt-link to="/blog" class="block font-medium px-4 py-1 md:p-2 lg:px-4">
            ব্লগ
          </nuxt-link>
        </li>

        <li
          v-for="(page, index) in pages"
          :key="index"
          class="block font-medium px-4 py-1 md:p-2 lg:px-4"
        >
          <nuxt-link :to="`/${page.slug}`">{{ page.title }}</nuxt-link>
        </li>

        <li>
          <button
            type="button"
            class="theme-toggle"
            aria-label="থিম পরিবর্তন করুন"
            @click="toggleTheme"
            @keyup.enter="toggleTheme"
          >
            <span aria-hidden="true">{{ isDark ? '🌙' : '☀️' }}</span>
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator';
import settings from '@/content/settings/general.json';

@Component
export default class Header extends Vue {
  get pages(): Page[] {
    return this.$store.state.pages;
  }

  logo = settings.logo;

  isDark = false;

  mounted(): void {
    this.isDark = this.preference() === 'dark';
    this.apply();
  }

  @Watch('isDark')
  apply(): void {
    if (process.client) {
      const root = document.documentElement;
      if (this.isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }

      try {
        window.localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
      } catch (error) {
        // ignore storage errors (private mode)
      }
    }
  }

  preference(): string {
    if (!process.client) {
      return 'light';
    }

    try {
      const saved = window.localStorage.getItem('theme');
      if (saved) {
        return saved;
      }
    } catch (error) {
      // ignore storage errors
    }

    return 'light';
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
  }
}
</script>

<style lang="scss">
.nav {
  ul li > a {
    color: $text-secondary;

    &.nuxt-link-active,
    &.nuxt-link-exact-active {
      color: $brand;
      @apply font-bold;
    }
  }
}

.logo-img {
  width: 2.25rem;
  height: 2.25rem;
}

.logo-word {
  font-weight: 700;
  font-size: 1.25rem;
  color: $heading;
}

.theme-toggle {
  @apply inline-flex items-center justify-center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: $surface;
  border: 1px solid $border;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: $brand;
    transform: translateY(-1px);
  }
}
</style>

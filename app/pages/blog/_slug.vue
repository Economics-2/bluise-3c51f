<template>
  <article class="post-detail" :class="post.slug">
    <header class="post-hero py-8 md:py-12 text-center mx-auto">
      <div class="post-meta-inline">
        <span v-if="post.publishedAt">{{ formatDate(post.publishedAt) }}</span>
        <span v-for="tag in post.tags" :key="tag" class="meta-tag">{{ tag }}</span>
      </div>
      <h1 class="text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold">
        {{ post.title }}
      </h1>
    </header>

    <div class="post-body prose-wrap pb-8 md:pb-24">
      <div v-html="$md.render(post.content)" class="post__content markdown" />
    </div>

    <div class="post-footer-nav pb-16">
      <nuxt-link to="/blog" class="back-link">← সব পোস্টে ফিরে যান</nuxt-link>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { MetaInfo } from 'vue-meta';
import { formatDate } from '@/utils';

@Component({
  head(): MetaInfo {
    return {
      title: this.post.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post.seoDescription,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: this.post.title,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.post.featuredImage || '/images/uploads/og.png',
        },
      ],
    };
  },
})
export default class BlogPost extends Vue {
  post!: Post;

  async asyncData({ params, payload }: Context): Promise<{ post: Post }> {
    if (payload) {
      return { post: payload };
    }

    try {
      const post = require(`@/content/blog/${params.slug}.json`);

      return {
        post,
      };
    } catch (e) {
      throw new Error('Not found');
    }
  }

  formatDate(value: string): string {
    return formatDate(value);
  }
}
</script>

<style lang="scss">
.post-detail {
  .post-hero {
    h1 {
      color: $heading;
      line-height: 1.3;
      max-width: 52rem;
      margin: 0.75rem auto 0;
    }
  }

  .post-meta-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    color: $text-secondary;
    font-size: 0.875rem;

    .meta-tag {
      padding: 0.2rem 0.7rem;
      border-radius: 9999px;
      background: $code-bg;
      color: $text-secondary;
      font-size: 0.75rem;
    }
  }

  .post-body {
    max-width: 46rem;
    margin: 0 auto;
  }

  .back-link {
    color: $brand;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>

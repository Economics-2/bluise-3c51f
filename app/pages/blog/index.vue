<template>
  <section class="blog">
    <div class="blog-head py-8 md:py-14 text-center">
      <h1 class="text-lg md:text-xl lg:text-4xl xl:text-5xl font-bold">ব্লগ</h1>
      <p class="text-base md:text-lg mt-2">
        প্রযুক্তির নানা বিষয়ে সহজ বাংলায় লেখা — টিউটোরিয়াল, গাইড আর বেস্ট প্র্যাকটিস।
      </p>
    </div>

    <!-- eslint-disable vue-a11y/click-events-have-key-events -->
    <div v-if="tags.length" class="filter-row pb-6 flex flex-wrap justify-center">
      <button type="button" class="tag-filter" :class="{ active: !activeTag }" @click="setTag('')">
        সব
      </button>
      <button
        v-for="tag in tags"
        :key="tag"
        type="button"
        class="tag-filter"
        :class="{ active: activeTag === tag }"
        @click="setTag(tag)"
      >
        {{ tag }}
      </button>
    </div>
    <!-- eslint-enable vue-a11y/click-events-have-key-events -->

    <p v-if="activeTag" class="filter-note">“{{ activeTag }}” বিষয়ের {{ posts.length }}টি পোস্ট</p>

    <div v-if="posts.length" class="flex flex-wrap md:-mx-4 pb-12">
      <div v-for="post in posts" :key="post.slug" class="w-full md:w-1/2 my-4 md:px-4">
        <article class="post">
          <nuxt-link :to="`/blog/${post.slug}`">
            <img
              :alt="post.title"
              class="w-full post-img"
              :src="post.featuredImage || '/images/uploads/placeholder.svg'"
            />
            <div class="p-6">
              <p class="post-meta">{{ formatDate(post.publishedAt) }}</p>
              <h2 class="text-2xl mb-2">{{ post.title }}</h2>

              <p class="text-base font-light">
                {{ post.excerpt }}
              </p>

              <div v-if="post.tags && post.tags.length" class="post-tags">
                <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
              </div>

              <h6 class="post-readmore mt-4 font-medium">আরও পড়ুন →</h6>
            </div>
          </nuxt-link>
        </article>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>এই বিষয়ে কোনো পোস্ট পাওয়া যায়নি।</p>
      <nuxt-link to="/blog" class="reset-btn">সব পোস্ট দেখুন</nuxt-link>
    </div>

    <Pagination
      v-if="!activeTag && totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
    />
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { Context } from '@nuxt/types';
import { MetaInfo } from 'vue-meta';
import { formatDate } from '@/utils';

const Pagination = () => import('@/components/commons/pagination.vue');

@Component({
  components: {
    Pagination,
  },

  head(): MetaInfo {
    return {
      title: 'ব্লগ',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'টেকভিউ ব্লগ — বাংলায় প্রযুক্তির টিউটোরিয়াল, গাইড ও বেস্ট প্র্যাকটিস।',
        },
      ],
    };
  },
})
export default class BlogIndex extends Vue {
  currentPage!: number;

  totalPages!: number;

  posts: Post[] = [];

  activeTag = '';

  async asyncData({
    params,
    query,
    store,
  }: Context): Promise<{
    currentPage: number;
    totalPages: number;
    posts: Post[];
  }> {
    const page: number = params.page ? parseInt(params.page, 10) : 1;
    const perPage: number = store.state.perPage || 4;

    let allPosts = store.state.posts || [];

    // Optional tag filter via query string.
    const tag = query.tag ? String(query.tag) : '';
    if (tag) {
      allPosts = allPosts.filter((post: Post) => (post.tags || []).includes(tag));
    }

    const range = page * perPage;
    const posts = allPosts.filter((post: Post, index: number) => {
      const indexPage = index + 1;
      return range - perPage < indexPage && indexPage <= range;
    });

    return {
      currentPage: page,
      totalPages: Math.ceil(allPosts.length / perPage),
      posts: posts || [],
    };
  }

  mounted(): void {
    if (this.$route.query.tag) {
      this.activeTag = String(this.$route.query.tag);
    }
  }

  get tags(): string[] {
    return this.$store.state.tags || [];
  }

  formatDate(value: string): string {
    return formatDate(value);
  }

  setTag(tag: string): void {
    this.activeTag = tag;

    if (process.client) {
      this.$router.replace({ query: tag ? { tag } : {} }).catch(() => undefined);
    }

    if (tag) {
      const allPosts = this.$store.state.posts || [];
      this.posts = allPosts.filter((post: Post) => (post.tags || []).includes(tag));
    } else {
      this.reloadPage();
    }
  }

  reloadPage(): void {
    if (!process.client) {
      return;
    }

    // Re-fetch the current (paginated) view without query filtering.
    const page: number = this.$route.params.page ? parseInt(this.$route.params.page, 10) : 1;
    const perPage: number = this.$store.state.perPage || 4;
    const allPosts = this.$store.state.posts || [];
    const range = page * perPage;

    this.posts = allPosts.filter(
      (post: Post, index: number) => range - perPage < index + 1 && index + 1 <= range
    );
  }
}
</script>

<style lang="scss">
.blog {
  .blog-head {
    h1 {
      color: $heading;
    }

    p {
      color: $text-secondary;
    }
  }
}

.filter-row {
  .tag-filter {
    @apply inline-block text-sm font-medium px-4 py-2 rounded-full m-1;
    background: $surface;
    border: 1px solid $border;
    color: $text-secondary;
    transition: all 0.2s ease;

    &:hover {
      border-color: $brand;
      color: $brand;
    }

    &.active {
      background: $brand;
      border-color: $brand;
      color: #fff;
    }
  }
}

.filter-note {
  text-align: center;
  color: $text-secondary;
  margin-bottom: 1rem;
}

.post {
  @apply shadow-md overflow-hidden;
  background: $surface;
  border: 1px solid $border;
  transition: all 0.2s cubic-bezier(0.64, 0, 0.35, 1);

  .post-img {
    height: 230px;
    object-fit: cover;
  }

  .post-meta {
    font-size: 0.75rem;
    color: $brand;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  h2 {
    color: $heading;
  }

  p {
    color: $text-secondary;
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;

    span {
      font-size: 0.7rem;
      padding: 0.2rem 0.6rem;
      border-radius: 9999px;
      background: $code-bg;
      color: $text-secondary;
    }
  }

  .post-readmore {
    color: $brand;
  }

  &:hover {
    @apply shadow-xl;
    border-color: $brand;
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: $text-secondary;

  .reset-btn {
    @apply inline-block text-sm font-semibold px-6 py-3 rounded-md mt-4;
    background: $brand;
    color: #fff;
  }
}
</style>

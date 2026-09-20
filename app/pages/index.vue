<template>
  <section class="home">
    <div class="hero py-16 md:py-24 mx-auto flex flex-wrap flex-col md:flex-row items-center">
      <div class="flex flex-col w-full xl:w-3/5 justify-center lg:items-start overflow-y-hidden">
        <div v-html="$md.render(welcomeText)" class="home__welcome markdown" />

        <div class="mb-10 xl:mb-0 w-full max-w-md">
          <h4 v-if="isSignedUp" class="signup-success">
            ধন্যবাদ! নতুন পোস্টের খবর আপনার ইনবক্সে যাবে।
          </h4>

          <form v-else @submit.prevent="handleSubmit" name="signups" netlify class="signup-form">
            <input
              ref="emailInput"
              v-model="form.email"
              class="signup-input"
              type="email"
              name="email"
              placeholder="আপনার@ইমেইল.com"
              aria-label="ইমেইল ঠিকানা"
            />
            <button class="signup-btn" type="submit">সদস্য হোন</button>
          </form>
        </div>
      </div>

      <div class="flex flex-col w-full xl:w-2/5">
        <img
          alt="টেকভিউ হিরো"
          class="rounded-lg shadow-lg w-full"
          src="/images/uploads/placeholder.svg"
        />
      </div>
    </div>

    <section class="featured-section pb-12">
      <h2 class="section-title">সাম্প্রতিক পোস্ট</h2>
      <div class="flex flex-wrap md:-mx-4">
        <div v-for="post in latestPosts" :key="post.slug" class="w-full md:w-1/3 my-4 md:px-4">
          <article class="post-card">
            <nuxt-link :to="`/blog/${post.slug}`">
              <img
                :alt="post.title"
                class="w-full card-img"
                :src="post.featuredImage || '/images/uploads/placeholder.svg'"
              />
              <div class="p-5">
                <p class="card-meta">{{ formatDate(post.publishedAt) }}</p>
                <h3 class="card-title">{{ post.title }}</h3>
                <p class="card-excerpt">{{ post.excerpt }}</p>
                <span class="card-readmore">আরও পড়ুন →</span>
              </div>
            </nuxt-link>
          </article>
        </div>
      </div>

      <div class="text-center mt-6">
        <nuxt-link to="/blog" class="all-posts-btn">সব পোস্ট দেখুন</nuxt-link>
      </div>
    </section>

    <section v-if="tags.length" class="tag-section pb-16">
      <h2 class="section-title">বিষয় অনুযায়ী খুঁজুন</h2>
      <div class="flex flex-wrap -mx-1">
        <nuxt-link v-for="tag in tags" :key="tag" :to="`/blog?tag=${tag}`" class="tag-pill">
          {{ tag }}
        </nuxt-link>
      </div>
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { MetaInfo } from 'vue-meta';
import settings from '@/content/settings/general.json';
import { formatDate } from '@/utils';

@Component({
  // Called to know which transition to apply
  transition() {
    return 'slide-left';
  },

  head(): MetaInfo {
    return {
      title: settings.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: settings.seoDescription,
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: settings.seoMetaImage,
        },
      ],
    };
  },
})
export default class Home extends Vue {
  welcomeText = settings.welcomeText;

  isSignedUp = false;

  form = {
    email: '',
  };

  get posts(): Post[] {
    return this.$store.state.posts;
  }

  get latestPosts(): Post[] {
    return this.posts.slice(0, 3);
  }

  get tags(): string[] {
    return this.$store.state.tags || [];
  }

  formatDate(value: string): string {
    return formatDate(value);
  }

  encode(data: Record<string, string>): string {
    return Object.keys(data)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  }

  validEmail(email: string): boolean {
    // eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async handleSubmit(): Promise<void> {
    if (!this.validEmail(this.form.email)) {
      (this.$refs.emailInput as HTMLInputElement).focus();
      return;
    }

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: this.encode({ 'form-name': 'signups', ...this.form }),
      });

      this.isSignedUp = true;
    } catch (error) {
      console.error(error);
    }
  }
}
</script>

<style lang="scss">
.hero {
  .home__welcome {
    h1 {
      font-size: 1.5rem;
      color: var(--heading);
      font-weight: 700;
      line-height: 1.4;
    }

    p {
      font-size: 1rem;
      margin-top: 1rem;
      color: var(--text-secondary);
      line-height: 1.8;
    }
  }
}

@media (min-width: 768px) {
  .hero {
    .home__welcome {
      h1 {
        font-size: 2rem;
      }

      p {
        font-size: 1.125rem;
      }
    }
  }
}

@media (min-width: 1024px) {
  .hero {
    .home__welcome {
      h1 {
        font-size: 2.5rem;
      }
    }
  }
}

.signup-form {
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 2px solid $brand;

  .signup-input {
    appearance: none;
    background: transparent;
    border: none;
    width: 100%;
    padding: 0.5rem;
    line-height: 1.25;
    color: var(--text);

    &:focus {
      outline: none;
    }
  }

  .signup-btn {
    flex-shrink: 0;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background: $brand;
    transition: background 0.2s ease;

    &:hover {
      background: $brand-dark;
    }
  }
}

.signup-success {
  color: $brand;
  font-weight: 600;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--heading);
}

@media (min-width: 768px) {
  .section-title {
    font-size: 1.5rem;
  }
}

.post-card {
  overflow: hidden;
  height: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
    border-color: $brand;
  }

  .card-img {
    height: 190px;
    object-fit: cover;
  }

  .card-meta {
    font-size: 0.75rem;
    color: $brand;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--heading);
    line-height: 1.4;
  }

  .card-excerpt {
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }

  .card-readmore {
    font-size: 0.875rem;
    font-weight: 600;
    color: $brand;
  }
}

.all-posts-btn {
  display: inline-block;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  background: $brand;
  color: #fff;
  transition: background 0.2s ease;

  &:hover {
    background: $brand-dark;
  }
}

.tag-section {
  .tag-pill {
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    margin: 0.25rem;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text-secondary);
    transition: all 0.2s ease;

    &:hover {
      background: $brand;
      border-color: $brand;
      color: #fff;
    }
  }
}
</style>

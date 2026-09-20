import { mount } from '@vue/test-utils';
import Page from '@/pages/index.vue';

// `$md` is injected by @nuxtjs/markdownit and `$store` by Vuex; the page does
// not mount without them (they are touched during render).
const createMountOptions = () => ({
  mocks: {
    $md: {
      render: (markdown) => markdown,
    },
    $store: {
      state: {
        posts: [],
        pages: [],
      },
    },
  },
  stubs: ['nuxt-link'],
});

describe('Page', () => {
  test('mounts properly', () => {
    const wrapper = mount(Page, createMountOptions());
    expect(wrapper.exists()).toBe(true);
  });

  test('renders the welcome heading from settings', () => {
    const wrapper = mount(Page, createMountOptions());
    expect(wrapper.text()).toContain('বাংলায় প্রযুক্তি শিখুন, নিজের ভাষায়।');
  });

  test('shows the signup form initially and hides it after submit', async () => {
    const wrapper = mount(Page, createMountOptions());
    expect(wrapper.find('form').exists()).toBe(true);

    wrapper.setData({ isSignedUp: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.find('form').exists()).toBe(false);
    expect(wrapper.text()).toContain('ধন্যবাদ! নতুন পোস্টের খবর আপনার ইনবক্সে যাবে।');
  });
});

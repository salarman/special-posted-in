<template>
  <ul class="space-y-1 hidden lg:block">
    <li v-for="(child, index) in props.headline.children" :key="child.fragment" class="space-y-1 hidden lg:block" :class="{
       'ml-3': props.isInner
    }">
      <a class="block text-sm/6 truncate" :href="`#${child.fragment}`"
         :class="scrollspy.activeHeadings.includes(child.fragment) ? config.active : config.inactive"
         @click.prevent="scrollToHeading(child.fragment)"> {{ child.title }}</a>
      <TableOfContents  v-if="props.headline.children.length > 0" :headline="props.headline.children[index]" :is-inner="true" />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import TocNode from "@/classes/implement/toc-node";
import {useScrollspy} from "@/store/scroll-spy";
import {usePagePrepareStore} from "@/store/prepare-post-store";
import {usePhotoViewStatusStore} from "@/store/photo-view-store";
import mermaid from "mermaid";

const router = useRouter();
const scrollspy = useScrollspy();
const nuxtApp = useNuxtApp();
const prepareStore = usePagePrepareStore();
const photoViewStatusStore = usePhotoViewStatusStore();
const props = defineProps<{
  headline: TocNode,
  isInner: boolean,
}>();
const config = {
  wrapper: 'space-y-1',
  base: 'block text-sm/6 truncate',
  active: 'text-primary',
  inactive: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
  depth: 'ml-3'
}

const emit = defineEmits(['move']);
const scrollToHeading = (id: string) => {
  router.push(`#${id}`)
  emit('move', id);
};

nuxtApp.hooks.hookOnce('page:finish', () => {
  if (prepareStore.isPrepare) {
    const imageTags = document.querySelectorAll('.rendered-markdown-wrapper img');
    imageTags.forEach((imgTag, index) => {
      imgTag.addEventListener('click', (e) => {
        photoViewStatusStore.open(index +1)
      });
    });
    scrollspy.updateHeadings(props.headline, [
      ...document.querySelectorAll('h2'),
      ...document.querySelectorAll('h3')
    ]);

    mermaid.initialize({ startOnLoad: true });
    prepareStore.done();
  }
});

</script>

<style lang="scss" scoped>
.outline-link {
  color: #3c3c3cb3;
  transition: color .25s;

  &:hover, :active {
    color: #213547;
  }
}

ul {
  list-style: none;
  padding-left: 1em;

  li {
    color: var(--vt-c-text-2);
    transition: color .5s;
    line-height: 28px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
    font-weight: 500;
  }
}

</style>

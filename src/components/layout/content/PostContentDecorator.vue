<template>
  <div class="rendered-markdown-wrapper" v-html="html"></div>
</template>
<script setup lang="ts">
import type {PostMetadata} from "@/classes/implement/PostMetadata";
import MarkdownIt from "markdown-it";
import {usePhotoViewStatusStore} from "@/store/photo-view-store";

const photoViewStore = usePhotoViewStatusStore();
const nuxtApp = useNuxtApp();
const props = defineProps<{
  metadata: PostMetadata
}>();

const html = computed(() => {
  const md: MarkdownIt = nuxtApp.$md as MarkdownIt;
  return md.render(props.metadata.content);
});

onMounted(() => {
  photoViewStore.load(props.metadata.header.images);
});

</script>

<style lang="scss">
@use "@styles/index" as *;
@use "@styles/markup" as *;
@use '@styles/languages' as *;
@use '@styles/icons' as *;

div[class*=language-].line-numbers-mode pre {
  margin-left: $code-ln-wrapper-width;
  padding-left: 1rem;
  vertical-align: middle;
}

div[class*=language-].line-numbers-mode {

  .line-numbers-wrapper {
    position: absolute;
    top: 0;
    width: $code-ln-wrapper-width;
    text-align: center;
    padding-top: 1.25rem;
    counter-reset: line-number;
    line-height: 1.4;

    .line-number {
      position: relative;
      user-select: none;
      color: #999;

      &:before {
        counter-increment: line-number;
        content: counter(line-number);
        font-size: .85em;

      }
    }
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: $code-ln-wrapper-width;
    height: 100%;
    border-radius: 6px 0 0 6px;
    border-right: 1px solid #777777;
  }
}


div[class*=language-] .highlight-lines {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  padding-top: 1.3rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  line-height: 1.4;
}

div[class*=language-].line-numbers-mode .highlight-lines .highlighted {
  position: relative;
}

div[class*=language-] .highlight-lines .highlighted {
  background-color: #5cbdfb59;
}


.rendered-markdown-wrapper {

  .\!h-\[39\.0625rem\] {
  height: 39.0625rem!important
  }

  .\!h-auto {
    height: auto!important
  }

  .h-0\.5 {
    height: .125rem
  }

  .h-1 {
    height: .25rem
  }

  .h-1\.5 {
    height: .375rem
  }

  .h-1\/2 {
    height: 50%
  }

  .h-1\/3 {
    height: 33.333333%
  }

  .h-1\/4 {
    height: 25%
  }

  .h-1\/5 {
    height: 20%
  }

  .h-1\/6 {
    height: 16.666667%
  }

  .h-10 {
    height: 2.5rem
  }

  .h-12 {
    height: 3rem
  }

  .h-14 {
    height: 3.5rem
  }

  .h-16 {
    height: 4rem
  }

  .h-18 {
    height: 4.5rem
  }

  .h-2 {
    height: .5rem
  }

  .h-2\.5 {
    height: .625rem
  }

  .h-20 {
    height: 5rem
  }

  .h-24 {
    height: 6rem
  }

  .h-28 {
    height: 7rem
  }

  .h-3 {
    height: .75rem
  }

  .h-3\.5 {
    height: .875rem
  }

  .h-32 {
    height: 8rem
  }

  .h-36 {
    height: 9rem
  }

  .h-4 {
    height: 1rem
  }

  .h-40 {
    height: 10rem
  }

  .h-48 {
    height: 12rem
  }

  .h-5 {
    height: 1.25rem
  }

  .h-52 {
    height: 13rem
  }

  .h-56 {
    height: 14rem
  }

  .h-6 {
    height: 1.5rem
  }

  .h-60 {
    height: 15rem
  }

  .h-64 {
    height: 16rem
  }

  .h-7 {
    height: 1.75rem
  }

  .h-72 {
    height: 18rem
  }

  .h-8 {
    height: 2rem
  }

  .h-80 {
    height: 20rem
  }

  .h-9 {
    height: 2.25rem
  }

  .h-96 {
    height: 24rem
  }

  .h-\[1\.375rem\] {
    height: 1.375rem
  }

  .h-\[20\.8125rem\] {
    height: 20.8125rem
  }

  .h-\[200px\] {
    height: 200px
  }

  .h-\[22rem\] {
    height: 22rem
  }

  .h-\[24\.25rem\] {
    height: 24.25rem
  }

  .h-\[2px\] {
    height: 2px
  }

  .h-\[3\.625rem\] {
    height: 3.625rem
  }

  .h-\[30\.625rem\] {
    height: 30.625rem
  }

  .h-\[31\.625rem\] {
    height: 31.625rem
  }

  .h-\[32rem\] {
    height: 32rem
  }

  .h-\[340px\] {
    height: 340px
  }

  .h-\[37\.5rem\] {
    height: 37.5rem
  }

  .h-\[395px\] {
    height: 395px
  }

  .h-\[4\.5rem\] {
    height: 4.5rem
  }

  .h-\[400px\] {
    height: 400px
  }

  .h-\[48px\] {
    height: 48px
  }

  .h-\[496px\] {
    height: 496px
  }

  .h-\[498px\] {
    height: 498px
  }

  .h-\[500px\] {
    height: 500px
  }

  .h-\[5px\] {
    height: 5px
  }

  .h-\[600px\] {
    height: 600px
  }

  .h-\[60px\] {
    height: 60px
  }

  .h-\[673px\] {
    height: 673px
  }

  .h-\[8\.75rem\] {
    height: 8.75rem
  }

  .h-\[calc\(0\.5rem\+1px\)\] {
    height: calc(.5rem + 1px)
  }

  .h-auto {
    height: auto
  }

  .h-dvh {
    height: 100dvh
  }

  .h-full {
    height: 100%
  }

  .h-lvh {
    height: 100lvh
  }

  .h-px {
    height: 1px
  }

  .h-screen {
    height: 100vh
  }

  .h-svh {
    height: 100svh
  }

  .\!max-h-\[24\.75rem\] {
    max-height: 24.75rem!important
  }

  .\!max-h-\[none\] {
    max-height: none!important
  }

  .max-h-24 {
    max-height: 6rem
  }

  .max-h-32 {
    max-height: 8rem
  }

  .max-h-40 {
    max-height: 10rem
  }

  .max-h-48 {
    max-height: 12rem
  }

  .max-h-56 {
    max-height: 14rem
  }

  .max-h-60 {
    max-height: 15rem
  }

  .max-h-64 {
    max-height: 16rem
  }

  .max-h-80 {
    max-height: 20rem
  }

  .max-h-96 {
    max-height: 24rem
  }

  .max-h-\[220px\] {
    max-height: 220px
  }

  .max-h-\[33rem\] {
    max-height: 33rem
  }

  .max-h-\[350px\] {
    max-height: 350px
  }

  .max-h-\[60vh\] {
    max-height: 60vh
  }

  .max-h-\[800px\] {
    max-height: 800px
  }

  .max-h-\[none\] {
    max-height: none
  }

  .max-h-dvh {
    max-height: 100dvh
  }

  .max-h-full {
    max-height: 100%
  }

  .max-h-lvh {
    max-height: 100lvh
  }

  .max-h-screen {
    max-height: 100vh
  }

  .max-h-svh {
    max-height: 100svh
  }

  .min-h-0 {
    min-height: 0
  }

  .min-h-24 {
    min-height: 6rem
  }

  .min-h-32 {
    min-height: 8rem
  }

  .min-h-40 {
    min-height: 10rem
  }

  .min-h-48 {
    min-height: 12rem
  }

  .min-h-64 {
    min-height: 16rem
  }

  .min-h-80 {
    min-height: 20rem
  }

  .min-h-\[220px\] {
    min-height: 220px
  }

  .min-h-\[37\.5rem\] {
    min-height: 37.5rem
  }

  .min-h-\[75dvh\] {
    min-height: 75dvh
  }

  .min-h-dvh {
    min-height: 100dvh
  }

  .min-h-full {
    min-height: 100%
  }

  .min-h-lvh {
    min-height: 100lvh
  }

  .min-h-svh {
    min-height: 100svh
  }

  .w-0 {
    width: 0
  }

  .w-0\.5 {
    width: .125rem
  }

  .w-1 {
    width: .25rem
  }

  .w-1\.5 {
    width: .375rem
  }

  .w-1\/2 {
    width: 50%
  }

  .w-1\/3 {
    width: 33.333333%
  }

  .w-1\/4 {
    width: 25%
  }

  .w-1\/5 {
    width: 20%
  }

  .w-1\/6 {
    width: 16.666667%
  }

  .w-10 {
    width: 2.5rem
  }

  .w-11 {
    width: 2.75rem
  }

  .w-12 {
    width: 3rem
  }

  .w-14 {
    width: 3.5rem
  }

  .w-16 {
    width: 4rem
  }

  .w-18 {
    width: 4.5rem
  }

  .w-2 {
    width: .5rem
  }

  .w-2\.5 {
    width: .625rem
  }

  .w-2\/3 {
    width: 66.666667%
  }

  .w-2\/5 {
    width: 40%
  }

  .w-20 {
    width: 5rem
  }

  .w-24 {
    width: 6rem
  }

  .w-28 {
    width: 7rem
  }

  .w-3 {
    width: .75rem
  }

  .w-3\.5 {
    width: .875rem
  }

  .w-3\/4 {
    width: 75%
  }

  .w-3\/5 {
    width: 60%
  }

  .w-32 {
    width: 8rem
  }

  .w-36 {
    width: 9rem
  }

  .w-4 {
    width: 1rem
  }

  .w-4\/5 {
    width: 80%
  }

  .w-40 {
    width: 10rem
  }

  .w-44 {
    width: 11rem
  }

  .w-48 {
    width: 12rem
  }

  .w-5 {
    width: 1.25rem
  }

  .w-5\/6 {
    width: 83.333333%
  }

  .w-52 {
    width: 13rem
  }

  .w-56 {
    width: 14rem
  }

  .w-6 {
    width: 1.5rem
  }

  .w-60 {
    width: 15rem
  }

  .w-64 {
    width: 16rem
  }

  .w-7 {
    width: 1.75rem
  }

  .w-72 {
    width: 18rem
  }

  .w-8 {
    width: 2rem
  }

  .w-80 {
    width: 20rem
  }

  .w-9 {
    width: 2.25rem
  }

  .w-96 {
    width: 24rem
  }

  .w-\[--input-width\] {
    width: var(--input-width)
  }

  .w-\[1\.5px\] {
    width: 1.5px
  }

  .w-\[108rem\] {
    width: 108rem
  }

  .w-\[119\.4375rem\] {
    width: 119.4375rem
  }

  .w-\[12px\] {
    width: 12px
  }

  .w-\[150\%\] {
    width: 150%
  }

  .w-\[19\.5rem\] {
    width: 19.5rem
  }

  .w-\[19rem\] {
    width: 19rem
  }

  .w-\[2\.0625rem\] {
    width: 2.0625rem
  }

  .w-\[216\%\] {
    width: 216%
  }

  .w-\[23\.625rem\] {
    width: 23.625rem
  }

  .w-\[3\.125rem\] {
    width: 3.125rem
  }

  .w-\[32rem\] {
    width: 32rem
  }

  .w-\[41\.1875rem\] {
    width: 41.1875rem
  }

  .w-\[45\.0625rem\] {
    width: 45.0625rem
  }

  .w-\[52\.6875rem\] {
    width: 52.6875rem
  }

  .w-\[536px\] {
    width: 536px
  }

  .w-\[5px\] {
    width: 5px
  }

  .w-\[67\.8125rem\] {
    width: 67.8125rem
  }

  .w-\[70\.0625rem\] {
    width: 70.0625rem
  }

  .w-\[71\.75rem\] {
    width: 71.75rem
  }

  .w-\[90rem\] {
    width: 90rem
  }

  .w-\[calc\(0\.5rem\+1px\)\] {
    width: calc(.5rem + 1px)
  }

  .w-auto {
    width: auto
  }

  .w-full {
    width: 100%
  }

  .w-px {
    width: 1px
  }

  .w-screen {
    width: 100vw
  }

  .min-w-0 {
    min-width: 0
  }

  .min-w-12 {
    min-width: 3rem
  }

  .min-w-24 {
    min-width: 6rem
  }

  .min-w-32 {
    min-width: 8rem
  }

  .min-w-40 {
    min-width: 10rem
  }

  .min-w-48 {
    min-width: 12rem
  }

  .min-w-64 {
    min-width: 16rem
  }

  .min-w-80 {
    min-width: 20rem
  }

  .min-w-\[220px\] {
    min-width: 220px
  }

  .min-w-full {
    min-width: 100%
  }

  .max-w-24 {
    max-width: 6rem
  }

  .max-w-2xl {
    max-width: 42rem
  }

  .max-w-32 {
    max-width: 8rem
  }

  .max-w-3xl {
    max-width: 48rem
  }

  .max-w-40 {
    max-width: 10rem
  }

  .max-w-48 {
    max-width: 12rem
  }

  .max-w-4xl {
    max-width: 56rem
  }

  .max-w-5xl {
    max-width: 64rem
  }

  .max-w-64 {
    max-width: 16rem
  }

  .max-w-7xl {
    max-width: 80rem
  }

  .max-w-80 {
    max-width: 20rem
  }

  .max-w-8xl {
    max-width: 90rem
  }

  .max-w-96 {
    max-width: 24rem
  }

  .max-w-\[220px\] {
    max-width: 220px
  }

  .max-w-\[26rem\] {
    max-width: 26rem
  }

  .max-w-\[52rem\] {
    max-width: 52rem
  }

  .max-w-\[calc\(100\%-3rem\)\] {
    max-width: calc(100% - 3rem)
  }

  .max-w-full {
    max-width: 100%
  }

  .max-w-lg {
    max-width: 32rem
  }

  .max-w-md {
    max-width: 28rem
  }

  .max-w-none {
    max-width: none
  }

  .max-w-prose {
    max-width: 65ch
  }

  .max-w-screen-2xl {
    max-width: 1536px
  }

  .max-w-screen-xl {
    max-width: 1280px
  }

  .max-w-sm {
    max-width: 24rem
  }

  .max-w-xl {
    max-width: 36rem
  }

  .max-w-xs {
    max-width: 20rem
  }
}
</style>

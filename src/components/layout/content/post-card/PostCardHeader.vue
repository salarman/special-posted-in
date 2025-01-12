<template>
  <div class="post-preview-header flex pt-4 px-3 mb-2">
    <div :class="ui.image.frame">
      <img :class="ui.image.source" :src="props.image" alt="Profile Image" />
    </div>
    <div :class="ui.author.wrapper">
      <a :href="`https://github.com/${props.nickname}`" target="_blank">
        <span :class="ui.author.name" aria-hidden="true">{{ appConfig.fullName }}</span>
      </a>
      <div :class="ui.author.intro" >
        <span aria-hidden="true">{{ props.position }} @ <strong>{{ props.company }}</strong></span>
        </div>
      <div :class="ui.date.wrapper">
        <span :class="ui.date.icon">
          <FontAwesomeIcon :icon="['fa', 'clock']"/>
        </span>
        <span :class="ui.date.value">{{ calPostDate(props.date) }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {calPostDate} from "@/utils/date-utils";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const appConfig = useAppConfig();
const props = defineProps<{
  image: string,
  nickname: string,
  position: string,
  company: string,
  date: string
}>();

const ui = {
  image: {
    frame: 'inline-block w-14 h-14 rounded-full overflow-hidden',
    source: 'bg-contain bg-no-repeat w-full h-full object-cover'
  },
  author: {
    wrapper: 'px-2.5 w-4/5',
    name: 'inline-block font-medium text-emerald-500 dark:text-emerald-50 whitespace-nowrap font',
    intro: 'text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap text-ellipsis overflow-hidden'
  },
  date: {
    wrapper: 'font-small-medium flex justify-start items-center text-gray-500 dark:text-gray-400',
    icon: 'px-1.5',
    value: 'inline-block'
  }
}
</script>
<style lang="scss" scoped>

.post-preview-header {
  display: flex;

  .profile-image {
    display: inline-block;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    overflow: hidden;
  }

  .author-info {
    padding: 0 10px;
    width: 80%;

    img {
      width: 15px;
      height: 15px;
    }
  }
}


@include tablet() {

  .post-preview-header {

    .author-info {

      .author-work-at {
        font-size: .84rem;
      }
    }
  }
}

@include mobile() {

  .post-preview-header {
    padding: 15px 15px;

    .author-info {

      .author-work-at {
        font-size: .84rem;
      }
    }
  }
}

.dark .post-preview-header {

  .author-info {

    .author-name {
      color: #2997ff;
      cursor: pointer;
    }

    .author-work-at {
      color: white;
    }
  }
}
</style>

import { reactive } from 'vue'
import {FileListData} from "@/class/implement/FileListData";
import {PostListWrapper} from "@/class/implement/PostListWrapper";

export const fileListStore = reactive<FileListData>({
    file_list: []
})

export const postListStore = reactive<PostListWrapper>({
    latest_index: 0,
    postDataList: []
})

export const postCallStore = reactive({
    is_calling: true
})

export const searchInputStore = reactive({
    input_text: '',
    result_list: []
})

export const mobileNaviStore = reactive({
    isActive: false
})

export const tabletNaviStore = reactive({
    isActive: false
})

export const menuClickableStore = reactive({
    isNotClickable: false
})

export const explorerHeaderStore = reactive({
    isActive: false
})

export const postMapStore = reactive({
    map: new Map()
})

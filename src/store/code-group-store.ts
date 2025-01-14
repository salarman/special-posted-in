import {defineStore} from "pinia";

export const useCodeGroupStore = defineStore('code-group', () => {

    const codeGroups = ref<Map<string, string>>(new Map<string, string>());

    function addCodeGroup(index: string, filename: string, code: string) {
        const key = `${useRoute().path}:${index}:${filename}`;
        codeGroups.value.set(key, code);
    }

    function getCodeGroup(index: string, filename: string): string {
        const key = `${useRoute().path}:${index}:${filename}`;
        const code = codeGroups.value.get(key);
        return code ?? '';
    }

    function refresh() {
        codeGroups.value.clear();
    }

    return {
        codeGroups,
        addCodeGroup,
        getCodeGroup,
        refresh
    }
});

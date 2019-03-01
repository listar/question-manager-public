<template>
    <div id="components-layout-basic">
        <a-layout>
            <a-layout-sider>Sider</a-layout-sider>
            <a-layout>
                <a-layout-header>Header</a-layout-header>
                <a-layout-content>

                    <transition name="page-transition">
                        <keep-alive v-if="keepAlive">
                            <router-view />
                        </keep-alive>
                        <router-view v-else />
                    </transition>

                </a-layout-content>
                <a-layout-footer>Footer</a-layout-footer>
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
    export default {
        name: "base",
        computed: {
            keepAlive () {
                return this.$route.meta.keepAlive
            }
        },
    }
</script>

<style scoped>

</style>
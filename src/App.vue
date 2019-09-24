<template>
    <v-app>
        <v-content>
            <router-view></router-view>
        </v-content>

    </v-app>

</template>
<script>
    import {router} from "./router";

    export default {
        name: "App",
        router,
        data() {
            return {}
        },
        mounted() {
        },

        methods: {},

        beforeDestroy() {
        },

        computed: {}
    };
</script>
<style>

</style>

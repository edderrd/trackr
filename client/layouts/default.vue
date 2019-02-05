<template>
  <v-app dark>
    <v-toolbar fixed app>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-progress-circular v-if="loading" size="25" width="2" indeterminate color="primary"></v-progress-circular>
      <v-avatar>
        <v-icon>person</v-icon>
      </v-avatar>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        title: 'Trackr'
      }
    },

    computed: {
      loading () {
        return this.$store.getters.loading
      },

      error: {
        get () {
          return this.$store.getters.error
        },
        set () {}
      }
    }
  }
</script>

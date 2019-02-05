<template>
  <v-list two-line>
    <v-list-tile @click="selectEntry(entry)" v-for="entry in entries" :key="entry.id">
      <v-list-tile-content>
        <v-list-tile-title>{{ entry.project }}</v-list-tile-title>
        <v-list-tile-sub-title><strong>{{ entry.category }} - </strong> {{ entry.comment }}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        {{entry.hours | number}}
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: {
    entries: {required: true}
  },

  methods: {
    selectEntry (entry) {
      this.$emit('selected', entry)
    }
  }
}
</script>

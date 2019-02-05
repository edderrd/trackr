<template>
  <v-layout column>
    <weekly-time-entries :service="service" v-for="service in services" :key="service.id"></weekly-time-entries>
    <!-- <time-entries-list :service="service" v-for="service in services"></time-entries-list> -->
  </v-layout>
</template>

<script>
import WeeklyTimeEntries from '@/components/WeeklyTimeEntries.vue'
import TimeEntriesList from '@/components/TimeEntries/List.vue'
export default {
  components: {WeeklyTimeEntries, TimeEntriesList},

  computed: {
    services () {
      return this.$store.getters['Service/services'] || []
    }
  },

  created () {
    this.$store.dispatch('Service/fetchServices')
  }
}
</script>


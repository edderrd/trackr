<template>
  <v-flex xs12>
    <v-toolbar class="transparent elevation-0">
      <v-toolbar-title>
        <span>{{ selectedTab | dateLong }}</span>
        <small v-if="service" class="ml-3">{{ service.name }}</small>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :ripple=false flat>Total: {{weekHours() | number}}</v-btn>
      <v-btn-toggle>
      <v-btn @click="weekBefore()">
        <v-icon>chevron_left</v-icon>
      </v-btn>
      <v-btn @click="setThisWeek()">
        {{ from | dateLong }} - {{ from.clone().endOf('isoWeek') | dateLong }}
      </v-btn>
      <v-btn @click="weekAfter()">
        <v-icon>chevron_right</v-icon>
      </v-btn>
      </v-btn-toggle>
      <v-btn v-if="service.type === 'Harvest'" icon @click="addEntry">
        <v-icon>add</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card>
        <v-tabs icons-and-text fixed-tabs v-model="selectedTab">
          <v-tab v-for="(entries, day) in entries" :href="`#${day}`" :key="day" @click="setTab(day)">
            <div class="pa-1 grey--text text--lighten-1">{{ totalHours(day) | number }}</div>
            <div class="pa-1">{{ toWeekDay(day) }}</div>
          </v-tab>
        </v-tabs>
        <v-progress-linear color="blue" v-if="loading" indeterminate></v-progress-linear>
      <v-card-text>
        <v-tabs-items v-model="selectedTab">
          <v-tab-item :id="day" v-for="(entries, day) in entries" :key="day">
            <weekly-time-entry :entries="entries" @selected="showEntry"></weekly-time-entry>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
    </v-card>
    <add-harvest-entry
      ref="addHarvestDialog"
      v-if="service.type === 'Harvest'"
      :service="service"
      :date="selectedTab"
    ></add-harvest-entry>

    <show-entry ref="showEntryDialog" :entry="selectedEntry"></show-entry>
  </v-flex>
</template>

<script>
import moment from 'moment'
import WeeklyTimeEntry from './WeeklyTimeEntry.vue'
import AddHarvestEntry from './AddHarvestEntry.vue'
import ShowEntry from './ShowEntry.vue'

export default {
  components: {WeeklyTimeEntry, AddHarvestEntry, ShowEntry},
  props: {
    service: {required: true}
  },

  data () {
    return {
      selectedTab: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      from: moment().startOf('isoWeek'),
      loading: false,
      selectedEntry: null
    }
  },

  computed: {
    entries () {
      var days = {}
      var day = this.from.clone()
      while (day < this.from.clone().endOf('isoWeek')) {
        days[day.format('YYYY-MM-DD')] = []
        day.add('1', 'day')
      }
      let data = this.$store.getters['TimeEntries/entries'](this.service)
      if (!data) return days
      data
        .forEach(entry => {
          let date = moment(entry.spentOn.replace('T01:00:00.000Z', ''))
          if (date >= this.from && date <= this.from.clone().endOf('isoWeek')) {
            if (days[date.format('YYYY-MM-DD')]) days[date.format('YYYY-MM-DD')].push(entry)
          }
        })
      return days
    }
  },

  created () {
    this.fetchEntries()
  },

  methods: {
    fetchEntries () {
      if (this.service) {
        this.loading = true
        this.$store.dispatch('TimeEntries/fetchEntries', this.service, {from: this.from, to: this.from.clone().endOf('isoWeek')})
          .then(() => {
            this.loading = false
          })
      }
    },

    setTab (day) {
      this.selectedTab = day
    },

    totalHours (day) {
      let results = 0
      this.entries[day].forEach(entry => {
        results += parseFloat(entry.hours)
      })
      return results
    },

    weekHours () {
      let results = 0
      for (let key in this.entries) {
        results += this.totalHours(key)
      }
      return results
    },

    setThisWeek () {
      this.from = moment().startOf('isoWeek')
      this.selectedTab = moment().format('YYYY-MM-DD')
    },

    weekBefore () {
      this.from = this.from.clone().subtract(1, 'week')
      this.selectedTab = this.from.format('YYYY-MM-DD')
    },

    weekAfter () {
      this.from = this.from.clone().add('1', 'week')
      this.selectedTab = this.from.format('YYYY-MM-DD')
    },

    toWeekDay (date) {
      return moment(date).format('dddd')
    },

    addEntry () {
      this.$refs.addHarvestDialog.show()
    },

    showEntry (entry) {
      this.selectedEntry = entry
      this.$refs.showEntryDialog.show()
    }
  }
}
</script>

<template>
  <v-flex xs12>
    <v-toolbar class="transparent" flat>
      <v-toolbar-title class="subheading" v-if="service">{{ service.name }} <small>{{ service.type }}</small></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat icon @click="showAddDialog">
        <v-icon>add</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="entries" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td :title="props.item.spentOn">{{ props.item.spentOn | dateLong }}</td>
        <td>{{ props.item.hours }}</td>
        <td>{{ props.item.category }}</td>
        <td>{{ props.item.task }}</td>
        <td>{{ props.item.comment }}</td>
      </template>
    </v-data-table>
    <add-dialog ref="addDialog"></add-dialog>
  </v-flex>
</template>

<script>
import AddDialog from './Add.vue'

export default {
  components: {AddDialog},

  props: {
    service: {required: true}
  },

  data () {
    return {
      headers: [
        {
          text: 'Date',
          align: 'left',
          sortable: false,
          value: 'spentOn'
        },
        {
          text: 'Hours',
          align: 'left',
          sortable: false,
          value: 'hours'
        },
        {
          text: 'Activity',
          align: 'left',
          sortable: false,
          value: 'activity'
        },
        {
          text: 'Task',
          align: 'left',
          sortable: false,
          value: 'task'
        },
        {
          text: 'Comment',
          align: 'left',
          sortable: false,
          value: 'comment'
        }
      ]
    }
  },

  computed: {
    entries () {
      let entries = this.$store.getters['TimeEntries/entries'](this.service) || []
      return entries.concat().sort((a, b) => new Date(a.spentOn) - new Date(b.spentOn))
    }
  },

  mounted () {
    if (this.service) {
      this.$store.dispatch('TimeEntries/fetchEntries', this.service)
    }
  },

  methods: {
    showAddDialog () {
      this.$refs.addDialog.show()
    }
  }
}
</script>

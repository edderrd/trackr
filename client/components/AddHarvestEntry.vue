<template>
  <v-dialog v-model="dialog" max-width=600>
    <v-card>
      <v-card-title class="title">
        Add Harvest Time Entry
        <v-spacer></v-spacer>
        <v-btn icon flat @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select label="Project / Task" :items="projects" item-text="name" v-model="project"></v-select>
        <v-select
          label="Category"
          item-text="label"
          :items="categories"
          v-model="task"
          :disabled="categories.length <= 0"
        >
          <template slot="item" slot-scope="data">
            <v-list-tile-avatar>
              <v-icon v-if="data.item.billable">attach_money</v-icon>
              <v-icon v-else class="grey--text">money_off</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-title>{{ data.item.name }}</v-list-tile-title>
          </template>
        </v-select>
        <v-text-field label="hours" type="number" v-model="hours"></v-text-field>
        <v-text-field multi-line label="Notes" v-model="notes"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn class="primary" @click="save">Add</v-btn>
        <v-btn flat @click="dialog = false">cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    service: {required: true},
    date: {required: true}
  },

  data () {
    return {
      dialog: false,
      categories: [],
      project: null,
      task: null,
      hours: null,
      notes: null
    }
  },

  created () {
    this.$store.dispatch('TimeEntries/fetchProjects', this.service)
  },

  watch: {
    project () {
      this.categories = this.projects.find(item => item.id === this.project.id).categories || []
      this.categoryId = null
    }
  },

  computed: {
    projects () {
      let projects = this.$store.getters['TimeEntries/projects'] || []

      return projects.map(item => {
        let categories = item.task_assignments.map(t => {
          return {
            ...t.task,
            billable: t.billable,
            label: `${t.task.name} ${t.billable ? '(billable)' : '(no billable)'}`
          }
        })
        return {
          ...item.project,
          categories
        }
      })
    }
  },

  methods: {
    show () {
      this.dialog = true
    },

    save () {
      this.$store.dispatch('TimeEntries/addTimeEntry', {
        metadata: {
          project_id: this.project.id,
          task_id: this.task.id,
          notes: this.notes,
          spent_date: `${this.date}T01:00:00.000Z`,
          hours: this.hours
        },
        comment: this.notes,
        spentOn: `${this.date}T01:00:00.000Z`,
        hours: this.hours,
        project: this.project.name,
        category: this.task.name,
        serviceId: this.service.id,
        sourceId: new Date().valueOf()
      })

      this.dialog = false
    }
  }
}
</script>

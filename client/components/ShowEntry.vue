<template>
  <v-dialog v-model="dialog">
    <v-card v-if="entry">
      <v-card-title>
        <span class="headline"> Entry for {{ entry.spentOn | dateLong }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <table>
          <tbody>
            <tr>
              <td><strong>Project</strong></td>
              <td>{{ entry.project }}</td>
            </tr>
            <tr>
              <td><strong>Category</strong></td>
              <td>{{ entry.category }}</td>
            </tr>
            <tr>
              <td><strong>Hours</strong></td>
              <td>{{ entry.hours }}</td>
            </tr>
            <tr>
              <td><strong>Task</strong></td>
              <td>{{ entry.task }}</td>
            </tr>
            <tr>
              <td><strong>Comments</strong></td>
              <td>{{ entry.comment }}</td>
            </tr>
          </tbody>
        </table>

      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    entry: {required: true}
  },

  data () {
    return {
      dialog: false
    }
  },

  methods: {
    show () {
      this.dialog = true
    }
  }
}
</script>


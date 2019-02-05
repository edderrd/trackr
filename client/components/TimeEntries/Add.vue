<template>
  <v-dialog v-model="dialog">
    <v-card>
      <v-card-title class="title">
        Add Time Entry
        <v-spacer></v-spacer>
        <v-btn icon flat @click="dialog = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field autofocus label="Task"></v-text-field>
        <v-text-field label="Description">
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn class="primary" @click="dialog = false">Add</v-btn>
        <v-btn flat @click="dialog = false">cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
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

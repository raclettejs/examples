<template>
  <div>
    <h1>{{ widgetState.title }}</h1>
    <div>
      <button @click="myEventbusFunction()" class="tw-border-solid">
        Say hello in the snackbar
      </button>
    </div>
    <div>
      <p>widget state:</p>
      <pre>{{ widgetState }}</pre>
      <button class="tw-border-solid" @click="setWidgetStateToTest()">
        set widget title to "test"
      </button>
    </div>

    <button class="tw-border-solid" @click="toggleTheme">toggle theme</button>
    <div>
      <p>The query:</p>

      <pre>{{ query }}</pre>
    </div>
    <!-- existing entries -->
    <div v-for="entry in data" :key="entry._id">
      <button @click="deleteEntry(entry._id)">-</button>
      <input
        :value="entry.name"
        @keydown.enter="updateEntry()"
        @change="
          changeEntry(entry._id, {
            name: $event.target.value,
            tagId: entry.tags[0] || null,
          })
        "
        class="tw-border-solid"
        type="text"
      />
      <select
        :value="entry.tags[0] || null"
        class="tw-border-solid"
        @change="
          changeEntry(entry._id, {
            name: entry.name,
            tagId: $event.target.value,
          })
        "
      >
        <option :value="null">No selection</option>
        <option v-for="tag in tags" :key="tag._id" :value="tag._id">
          {{ tag.title }}
        </option>
      </select>
      <button @click="updateEntry(entry._id, 'TEST')">update</button>
    </div>

    <!-- new -->
    <template v-if="true">
      <input
        @keydown.enter="addNewEntry()"
        v-model="newEntry.name"
        class="tw-border-solid"
        type="text"
      />
      <select class="tw-border-solid" v-model="newEntry.tagId">
        <option :value="null">No selection</option>
        <option v-for="tag in tags" :key="tag._id" :value="tag._id">
          {{ tag.title }}
        </option>
      </select>
      <button @click="addNewEntry()">+</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { usePluginApi } from "@raclettejs/raclette-core/orchestrator/composables"

const props = defineProps({
  uuid: {
    type: String,
    required: true,
  },
})

const { $data, $store, $socket, $eventbus } = usePluginApi()

// fetch all data
const { data, execute, query } = $data.todo.getAll({
  options: { immediate: true },
})

// get all tags
const { data: tags, query: tagsQuery } = $data.tag.getAll({
  options: { immediate: true },
})

// listen to the broadcast 'todoCreated' and execute the data fetching again
$socket.todoCreated.on(() => execute())
$socket.todoDeleted.on(() => execute())

type Entry = {
  name: string
  tagId: string | null
}
const newEntry = ref<Entry>({
  name: "",
  tagId: null,
})
const updatedEntries = ref<Record<string, Entry>>({})

const addNewEntry = () => {
  // TODO: discuss with @michelle how to get a usable type for CreateTodo
  $store.createData(
    { name: newEntry.value.name, tags: [newEntry.value.tagId] },
    "todo",
  )

  // empty the model
  newEntry.value = { name: "", tagId: null }
}

const updateEntry = (id: string, value: string) => {
  $store.updateData(id, {
    name: updatedEntries.value[id].name,
    tags: [updatedEntries.value[id].tagId],
  })
  delete updatedEntries.value[id]
}

const deleteEntry = (id: string) => $store.deleteData(id)

const changeEntry = (id: string, entry: Entry) => {
  updatedEntries.value[id] = entry
}

const widgetState = $store.getWidgetState()

const currentTheme = ref<"dark" | "light">("dark")
const toggleTheme = () => {
  currentTheme.value = currentTheme.value === "dark" ? "light" : "dark"
  $store.setUiState({ theme: currentTheme.value })
}

const setWidgetStateToTest = () =>
  $store.setWidgetState({
    title: "Test",
  })

let counter = 0

const myEventbusFunction = () => {
  $eventbus.global.emit("ui_addToSnackBar", {
    message: `HALLLOOOOO ${counter++}`,
    color: "purple",
  })
}
</script>

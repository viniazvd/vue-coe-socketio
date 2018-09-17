<h1 align="center">vue-coe-socketio ✅</h1>

<p align="center">
  <q>based on `socketio-client`</q>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/npm/l/vuelidation.svg" alt="License" target="_blank"></a>
</p>

<p align="center">
  ✨ <a href="https://codesandbox.io/s/github/viniazvd/chat-websocket/tree/master/ws-client">Example</a>✨
</p>

**Install**

`yarn add vue-coe-socketio@latest`

**Include Plugin**
```javascript
import Vue from 'vue'

import VueCoeWebSocket from 'vue-coe-socketio'

Vue.use(VueCoeWebSocket, '127.0.0.1:4000')
```

**Use**
```vue
<template>
  <div id="app">
    <div>
      <h3>Chat</h3>
      <div>
        <div v-for="(msg, index) in messages" :key="index">
          <p>{{ msg.user }}: {{ msg.message }}</p>
        </div>
      </div>
    </div>

    <div>
      <form @submit.prevent="sendMessage">
        <div>
          <label for="user">User:</label>
          <input type="text" v-model="user">
        </div>
        <div>
          <label for="message">Message:</label>
          <input type="text" v-model="message">
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: '',
      message: '',
      messages: []
    }
  },

  sockets: {
    IS_CONNECTED (status) {
      if (status === 'connected') {
        console.log('ws is: ', status)
      } else {
        console.warn('you are not connected')
      }
    },

    NEW_MESSAGE (msg) {
      this.messages = [ ...this.messages, msg ]
    }
  },

  methods: {
    sendMessage () {
      const payload = { user: this.user, message: this.message }

      this.$socket.emit('SEND_MESSAGE', payload)

      this.message = ''
    }
  },

  mounted () {
    this.$socket.emit('CONNECT')
  }
}
</script>
```

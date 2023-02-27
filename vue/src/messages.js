import { reactive } from 'vue'

/** @type {Record<string, import("./api").IMessage>} */
export const messages = reactive({})

/**
 *
 * @param {string} content
 * @param {number} life Time in miliseconds
 * @param {import("./api").TMsgSeverity } severity
 * @param {boolean} closable
 */
export function showMessage(content, life, severity, closable = true) {
   const message = createMessage(content, life, severity, closable)
   const existingMessage = findMsg(message)
   if (existingMessage !== undefined) {
      clearTimeout(existingMessage.timeOut)
      existingMessage.timeOut = setTimeout(() => { if (existingMessage) delete messages[existingMessage.id]; }, life)
      existingMessage.closeTime = Date.now() + life
   } else addMessage(content, life, severity, closable)
}

/** @param {string} id */
export function msgClose(id) {
   delete messages[id]
}

export function ClearMessages() {
   for (const key in messages) delete messages[key]
}

/**
 *
 * @param {import("./api").IMessage} msg1
 * @param {import("./api").IMessage} msg2
 * @returns
 */
function msgsIsAlmostCoincide(msg1, msg2) {
   return msg1.content === msg2.content && msg1.severity === msg2.severity && msg1.closable === msg2.closable
}

/** @param {import("./api").IMessage} msg */
function findMsg(msg) {
   for (const key in messages) {
      if (msgsIsAlmostCoincide(messages[key], msg)) {
         return messages[key]
      }
   }
}

/**
 * @param {string} content
 * @param {number} life Time in miliseconds
 * @param {import("./api").TMsgSeverity } severity
 * @param {boolean} closable
 * @returns {import("./api").IMessage}
 */
function createMessage(content, life, severity, closable) {
   const id = Math.random().toString();
   const timeOut = setTimeout(() => { delete messages[id] }, life)
   return { id, content, life, severity, closable, timeOut, closeTime: Date.now() + life }
}

/**
 * @param {string} content
 * @param {number} life Time in miliseconds
 * @param {import("./api").TMsgSeverity } severity
 * @param {boolean} closable
 */
function addMessage(content, life, severity, closable) {
   const id = Math.random().toString();
   const timeOut = setTimeout(() => { delete messages[id] }, life)
   messages[id] = { id, content, life, severity, closable, timeOut, closeTime: Date.now() + life }
}


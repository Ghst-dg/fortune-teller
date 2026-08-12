import chaiBreak from '../data/fortunes/chai-break.json'
import greatUndo from '../data/fortunes/great-undo.json'
import greenBuild from '../data/fortunes/green-build.json'
import rubberDuck from '../data/fortunes/rubber-duck.json'
import tinyPr from '../data/fortunes/tiny-pr.json'

const fortunes = [...greenBuild, ...rubberDuck, ...chaiBreak, ...tinyPr, ...greatUndo]

export function hashString(value) {
  return [...value].reduce((hash, char) => {
    const next = (hash << 5) - hash + char.charCodeAt(0)
    return next | 0
  }, 7)
}

export function stableIndex(signature, length) {
  if (!Number.isInteger(length) || length < 1) return -1
  return (hashString(String(signature)) >>> 0) % length
}

export function makeVariantSignature(seed, revision, stage, slot = 'default') {
  return `${seed}:${revision}:${stage}:${slot}`
}

export function pickStableItem(items, signature) {
  const index = stableIndex(signature, items.length)
  return index < 0 ? undefined : items[index]
}

export function pickFortune(name, dateOfBirth, cardId, seed) {
  const linked = fortunes.filter((fortune) => fortune.cardId === cardId)
  if (!linked.length) throw new Error(`No fortunes linked to tarot card: ${cardId}`)
  const hash = Math.abs(hashString(`${name}:${dateOfBirth}:${cardId}:${seed}`))
  return linked[hash % linked.length]
}

export function pickRandomItem(items) {
  if (!items.length) return undefined
  if (globalThis.crypto?.getRandomValues) {
    const range = 2 ** 32
    const ceiling = range - (range % items.length)
    const buffer = new Uint32Array(1)
    do crypto.getRandomValues(buffer)
    while (buffer[0] >= ceiling)
    return items[buffer[0] % items.length]
  }
  return items[Math.floor(Math.random() * items.length)]
}

export function makeSessionSeed() {
  if (globalThis.crypto?.getRandomValues) {
    const entropy = crypto.getRandomValues(new Uint32Array(2))
    return `${Date.now().toString(36)}-${entropy[0].toString(36)}${entropy[1].toString(36)}`
  }
  const entropy = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)
  return `${Date.now().toString(36)}-${entropy}`
}

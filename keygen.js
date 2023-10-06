#!/usr/bin/env node
const HyperDHT = require('hyperdht')
const fs = require('fs')
const argv = require('minimist')(process.argv.slice(2))
const libKeys = require('@hyper-cmd/lib-keys')

function storeKeyPair (k) {
  return JSON.stringify({
    secretKey: k.secretKey.toString('hex'),
    publicKey: k.publicKey.toString('hex')
  }, null, 2)
}

const helpMsg = 'Usage:\nhyper-cmd-util-keygen --gen_seed [filename.json] | --gen_keypair filename.json'
const isArgValid = argv.gen_seed || argv.gen_keypair

if (argv.gen_seed) {
  let seed = libKeys.randomBytes(32).toString('hex')

  if (typeof argv.gen_seed === 'string') {
    const file = argv.gen_seed

    fs.writeFileSync(file, JSON.stringify({ seed }, null, 2))

    seed = `<saved to file: ${file}>`
  }

  console.log('Seed:', seed)
  process.exit(-1)
}

if (argv.gen_keypair) {
  const kp = HyperDHT.keyPair()
  const file = argv.gen_keypair

  if (typeof file !== 'string' || file.length < 2) {
    console.error('Please provide a valid filename')
    console.log(helpMsg)
    process.exit(-1)
  }

  fs.writeFileSync(file, storeKeyPair(kp))
  console.log('Public Key:', kp.publicKey.toString('hex'))
  process.exit(-1)
}

if (!isArgValid || argv.help) {
  console.log(helpMsg)
  process.exit(-1)
}

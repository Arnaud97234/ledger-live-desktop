// @flow
import logger from 'logger'
import throttle from 'lodash/throttle'
import noop from 'lodash/noop'
import type Transport from '@ledgerhq/hw-transport'
import { DisconnectedDevice, CantOpenDevice } from 'config/errors'
import { retry } from './promise'

let TransportNodeHid
if (process.env.NODE_ENV === 'test') {
  TransportNodeHid = {
    setListenDevicesPollingSkip: noop,
    open: noop,
  }
} else {
  TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default
}

// all open to device must use openDevice so we can prevent race conditions
// and guarantee we do one device access at a time. It also will handle the .close()
// NOTE optim: in the future we can debounce the close & reuse the same transport instance.

type WithDevice = (devicePath: string) => <T>(job: (Transport<*>) => Promise<*>) => Promise<T>

const mapError = e => {
  if (e && e.message && e.message.indexOf('cannot open device with path') >= 0) {
    throw new CantOpenDevice(e.message)
  }
  if (e && e.message && e.message.indexOf('HID') >= 0) {
    throw new DisconnectedDevice(e.message)
  }
  throw e
}

let queue = Promise.resolve()

let busy = false

TransportNodeHid.setListenDevicesPollingSkip(() => busy)

const refreshBusyUIState = throttle(() => {
  if (process.env.CLI) return
  process.send({
    type: 'setDeviceBusy',
    busy,
  })
}, 100)

export const withDevice: WithDevice = devicePath => job => {
  const p = queue.then(async () => {
    busy = true
    refreshBusyUIState()
    try {
      // $FlowFixMe not sure what's wrong
      const t = await retry(() => TransportNodeHid.open(devicePath), { maxRetry: 2 }).catch(
        mapError,
      )
      t.setDebugMode(logger.apdu)
      try {
        const res = await job(t).catch(mapError)
        return res
      } finally {
        await t.close()
      }
    } finally {
      busy = false
      refreshBusyUIState()
    }
  })

  queue = p.catch(() => null)

  return p
}

import { Application } from 'spectron'

import { delay } from 'helpers/promise'

let app

const TIMEOUT = 50 * 1000

describe('Application launch', () => {
  beforeEach(async () => {
    app = new Application({
      path: './dist/ledger-live-desktop-1.1.0-linux-x86_64.AppImage',
      env: {
        SKIP_ONBOARDING: '1',
      },
    })
    await app.start()
  }, TIMEOUT)

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  }, TIMEOUT)

  test(
    'Start app and set developper mode ',
    async () => {
      const title = await app.client.getTitle()
      expect(title).toEqual('Ledger Live')
      await app.client.waitUntilWindowLoaded()
      await waitForDisappear(app, '#preload')

      // Post Onboarding
      await waitForExpectedText(app, '[data-e2e=onboarding_title]', 'Analytics and bug reports')

      await app.client.click('[data-e2e=continue_button]')

      await waitForExpectedText(app, '[data-e2e=finish_title]', 'Your device is ready!')
      await app.client.click('[data-e2e=continue_button]')

      await waitForExpectedText(app, '[data-e2e=disclaimer_title]', 'Trade safely')
      await app.client.click('[data-e2e=continue_button]')

      // Dashboard EmptyState
      await waitForExpectedText(
        app,
        '[data-e2e=dashboard_empty_title]',
        'Add accounts to your portfolio',
      )

      // Open Settings
      await app.client.click('[data-e2e=setting_button]')
      await waitForExpectedText(app, '[data-e2e=settings_title]', 'Settings')

      // DevMode ON
      await app.client.click('[data-e2e=devMode_button]')
    },
    TIMEOUT,
  )
})

function waitForExpectedText(app, selector, expected, maxRetry = 5) {
  async function check() {
    if (!maxRetry) {
      throw new Error(`Cant find the element ${selector} in the page`)
    }
    try {
      const str = await app.client.getText(selector)
      if (str === expected) {
        return true
      }
    } catch (err) {} // eslint-disable-line
    await delay(500)
    --maxRetry
    return check()
  }
  return check()
}

function waitForDisappear(app, selector, maxRetry = 5) {
  async function check() {
    if (!maxRetry) {
      throw new Error('Too many retries for waiting element to disappear')
    }
    try {
      await app.client.getText(selector)
    } catch (err) {
      if (err.message.startsWith('An element could not be located')) {
        return true
      }
    }
    await delay(500)
    --maxRetry
    return check()
  }
  return check()
}

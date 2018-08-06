const Application = require('spectron').Application

let app

const TIMEOUT = 50 * 1000

describe('Application launch', ()=> {
  beforeEach(async () => {
    app = new Application({
      path: './dist/ledger-live-desktop-1.1.1-linux-x86_64.AppImage',
      env: {
        SKIP_ONBOARDING:'1'
      }
    })
    await app.start()
  }, TIMEOUT)

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop()
    }
  }, TIMEOUT)

  test('dasboard_element_check', async ()=> {
    const title = await app.client.getTitle()
    expect(title).toEqual('Ledger Live')
    await app.client.waitUntilWindowLoaded()
    await app.client.pause(2000)

//    Dashboard
const accountList = await app.client.getHTML('[data-e2e=dashboard_AccountList]', false)
  })
})

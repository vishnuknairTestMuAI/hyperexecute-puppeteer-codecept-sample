const { setHeadlessWhen } = require('@codeceptjs/configure');

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

const capabilities = {
  'browserName': 'Chrome',
  // Chrome 136+ ignores --remote-debugging-port on the default profile, which the
  // HyperExecute VM relies on, so the CDP connection never opens with 'latest'
  'browserVersion': '135',
  'LT:Options': {
    'platform': process.env.HYPEREXECUTE_PLATFORM,
    'build': 'Puppeteer CodeceptJS HyperExecute Build',
    'name': 'Puppeteer CodeceptJS HyperExecute Test',
    'user': process.env.LT_USERNAME,
    'accessKey': process.env.LT_ACCESS_KEY,
    'network': true,
    'video': true,
    'console': true
  }
};

exports.config = {
  tests: './*_test.js',
  output: './output',
  helpers: {
    Puppeteer: {
      chrome: {
        browserWSEndpoint: `wss://cdp.lambdatest.com/puppeteer?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`,
        "ignoreHTTPSErrors": true,
        // Chrome's privacy sandbox dialog shows up as a page that never attaches and hangs the helper
        targetFilter: (target) => !target.url().startsWith('chrome://privacy-sandbox-dialog')
      }
    }
  },
  include: {
    I: './steps_file.js'
  },
  bootstrap: null,
  mocha: {},
  name: 'puppeteer-codecept-sample',
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true
    },
    tryTo: {
      enabled: true
    },
    screenshotOnFail: {
      enabled: true
    }
  }
}

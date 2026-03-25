class VerboseReporter {
  constructor() {
    this.specCount = 0;
    this.failureCount = 0;
  }

  specDone(result) {
    this.specCount++;
    const isPass = result.status === 'passed';
    const status = isPass ? '\x1b[32m✓\x1b[0m' : '\x1b[31m✗\x1b[0m';
    const color = isPass ? '\x1b[32m' : '\x1b[31m';
    console.log(`  ${status} ${color}${result.description}\x1b[0m`);
    
    if (result.status === 'failed') {
      this.failureCount++;
      result.failedExpectations.forEach(expectation => {
        console.log(`    \x1b[31mError: ${expectation.message}\x1b[0m`);
      });
    }
  }

  suiteDone(result) {
    console.log(`\n\x1b[36m${result.description}\x1b[0m\n`);
  }

  suiteStarted(result) {
    console.log(`\n\x1b[36m${result.description}\x1b[0m`);
  }

  jasmineDone() {
    const color = this.failureCount === 0 ? '\x1b[32m' : '\x1b[31m';
    console.log(`\n\n${color}Finished: ${this.specCount} specs, ${this.failureCount} failures\x1b[0m`);
  }
}

module.exports = VerboseReporter;

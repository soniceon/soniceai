const { exec } = require('child_process');

const host = '0.0.0.0';
const port = 3003;

const command = `cross-env NODE_ENV=development HOST=${host} PORT=${port} next dev`;

const child = exec(command);

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on('exit', (code) => {
  process.exit(code);
}); 
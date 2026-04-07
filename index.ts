import concurrently from 'concurrently';

// instead of running file inside of packages/server, run it in main directory
concurrently([
   {
      name: 'server',
      command: 'bun run dev',
      cwd: 'packages/server',
      prefixColor: 'cyan',
   },
   {
      name: 'client',
      command: 'bun run dev',
      cwd: 'packages/client',
      prefixColor: 'green',
   },
]);

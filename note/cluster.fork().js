const cluster = require("cluster");
const http = require("http");
const os = require("os");

// Check if the current process is the master process
if (cluster.isMaster) {
  console.log(`Master process ID: ${process.pid}`);

  // Get the number of CPU cores available
  const numCPUs = os.cpus().length;
  console.log(`Forking ${numCPUs} workers...`);

  // Fork worker processes equal to the number of CPU cores
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Listen for worker exit events and optionally restart them
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} exited. Code: ${code}, Signal: ${signal}`
    );
    console.log("Spawning a new worker...");
    cluster.fork(); // Optionally, restart a new worker when one exits
  });
} else {
  // This block is executed in each worker process
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end(`Hello from Worker ${process.pid}`);
    })
    .listen(3000);

  console.log(`Worker ${process.pid} started and listening on port 3000`);
}
/* How This Works:

    Master Process:
        When you run the script, the process starts as the master process (cluster.isMaster is true).
        The master process forks a number of worker processes equal to the number of CPU cores using cluster.fork().
        The master process also listens for the exit event to detect when a worker dies, and can optionally restart it.

    Worker Processes:
        Each worker process runs the same code, but the cluster.isMaster check ensures they execute the code block inside the else statement.
        Each worker creates an HTTP server that listens on port 3000 and handles incoming requests.

As a result, you have multiple processes (equal to the number of CPU cores) running your Node.js server concurrently, allowing you to handle a higher number of incoming reques

Understanding cluster.fork() in Node.js

The cluster module in Node.js is a powerful feature that allows you to create multiple instances (or "workers") of your Node.js application to take full advantage of multi-core systems. This is especially useful since the standard Node.js runtime is single-threaded by default, meaning it can only utilize one CPU core at a time. By using the cluster module, you can create a multi-process environment that enables Node.js to handle more concurrent requests efficiently.
How Does cluster.fork() Work?

The cluster.fork() method is used to create new worker processes that are copies of the main process (also known as the "master" process). Each worker process runs independently and can handle incoming requests concurrently, but they all share the same server port.

The workers communicate with the master process via Inter-Process Communication (IPC), enabling message passing between them. This architecture allows for greater scalability, as you can spawn multiple processes that work together to handle incoming requests. */

# Test App for Transaction onSnapshot Notifications

This small Firestore app tests how onSnapshot() notifications fire when
documents are updated in a transaction.

See https://groups.google.com/g/google-cloud-firestore-discuss/c/tORo0hykByc/m/RuYaMoCmBQAJ

## Common Setup for both Browser and Node

1. Run `npm install` to install dependencies.
2. Edit `firebase_config.ts` to fill out your `apiKey` and `projectId`
   (not required if you only want to use the Firestore emulator).
3. See the test code in `run_the_test.ts`.

## Run in a Browser

1. Run `npm run build` to generate the compiled JavaScript.
2. Open `index.html` in a web browser, and click the "Run Test" button.

## Run in Node.js

1. Run `npm run run` to run the code in Node on the command line.

To connect to the Firestore emulator, specify `-e`.
To enable Firestore debug logging, specify `-v`.

Example:
```
npm run run -- -e -v
```

## Interpreting the Output

The log lines like

```
[snapshot listener] GOT size=NNN ...
```

are printed every time that the snapshot listener is notified.
I was wondering if it gets intermediate invocations as the transaction
is partially committed; however, it only gets notified once before
the transaction starts then once with the completed transaction.

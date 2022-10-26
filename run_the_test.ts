/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  runTransaction,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  Firestore,
  DocumentReference,
  DocumentSnapshot
} from '@firebase/firestore';

import { log } from './logging';
import { createDocuments, createEmptyCollection, generateValue } from './util';

/**
 * Runs the test.
 *
 * Replace the body of this function with the code you would like to execute
 * when the user clicks the "Run Test" button in the UI.
 *
 * @param db the `Firestore` instance to use.
 */
export async function runTheTest(db: Firestore): Promise<void> {
  const collectionRef = createEmptyCollection(db, 'RunTransactionBatchTest_');

  log(`onSnapshot(${collectionRef.path})`);
  onSnapshot(collectionRef, {
    next: snapshot => {
      log(
        `[snapshot listener] GOT size=${snapshot.size}` +
          ` fromCache=${snapshot.metadata.fromCache}` +
          ` hasPendingWrites=${snapshot.metadata.hasPendingWrites}`
      );
    },
    error: error => {
      log(`[snapshot listener] ERROR: ${error}`);
    }
  });

  log('runTransaction()');
  await runTransaction(db, async transaction => {
    const documentRefs: Array<DocumentReference> = [];
    for (let i = 0; i < 200; i++) {
      documentRefs.push(doc(collectionRef, `doc${i}`));
    }

    log(
      `[in transaction] Getting ${documentRefs.length} documents from ${collectionRef.path}`
    );
    const transactionGetPromises: Array<Promise<DocumentSnapshot>> = [];
    for (const documentRef of documentRefs) {
      const transactionGetPromise = transaction.get(documentRef);
      transactionGetPromises.push(transactionGetPromise);
    }
    await Promise.all(transactionGetPromises);

    log(
      `[in transaction] Updating ${documentRefs.length} documents in ${collectionRef.path}`
    );
    for (const documentRef of documentRefs) {
      transaction.set(documentRef, { randomData: generateValue() });
    }
  });

  log('runTransaction() completed');
}

import * as admin from "firebase-admin";
import { ensureDir, readFileSync, writeFileSync, unlinkSync } from "fs-extra";
import { join } from "path";
import { asyncForEach, filter, parse } from "./utils";

const serviceAccount = require("../serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://" + serviceAccount["project_id"] + ".firebaseio.com",
});
const collection: FirebaseFirestore.CollectionReference = admin
  .firestore()
  .collection("restaurants");

// https://data.austintexas.gov/Health-and-Community-Services/Food-Establishment-Inspection-Scores/ecmv-9xxi
const austin = JSON.parse(
  readFileSync(join(__dirname, "../", "cities/austin.json"), "utf8")
);
// https://data.cityofchicago.org/Health-Human-Services/Restaurant/5udb-dr6f/data
const chicago = JSON.parse(
  readFileSync(join(__dirname, "../", "cities/chicago.json"), "utf8")
);
// https://docs.mongodb.com/getting-started/shell/import-data/
const newYork = JSON.parse(
  readFileSync(join(__dirname, "../", "cities/new-york.json"), "utf8")
);

const cacheFiles: string[] = [];
const restaurants: any[] = [
  ...filter(austin),
  ...filter(chicago),
  ...filter(newYork),
];
let length = restaurants.length;
const folder = join(__dirname, "../", "temp");
console.log(`Inserting ${length} restaurants`);

ensureDir(folder).then(() => {
  while (restaurants.length) {
    const temp = restaurants.splice(0, 500);
    const path = join(folder, Date.now() + Math.random() + ".json");
    writeFileSync(path, JSON.stringify(temp));
    cacheFiles.push(path);
  }

  (async () => {
    asyncForEach(cacheFiles, async (path) => {
      const batchedData: any[] = parse(JSON.parse(readFileSync(path, "UTF8")));
      const batch: FirebaseFirestore.WriteBatch = admin.firestore().batch();
      batchedData.forEach((item) => {
        const insert = collection.doc();
        batch.create(insert, item);
      });
      await batch.commit().then(() => {
        length -= batchedData.length;
        console.log(
          `Inserted ${batchedData.length} docs, ${length} docs remaining`
        );
        console.log(`Deleting ${path}`);
        unlinkSync(path);
      });
    });
  })();
});

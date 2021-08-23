/* let indexeddatabase; */
const request = indexedDB.open('budget', 1);

//creates objects to store offline inputs
request.onupgradeneeded = function (event) {
const indexeddatabase = event.target.result;
 indexeddatabase.createObjectStore('pending', {autoIncrement: true});
};

request.onsuccess = function (event) {
indexeddatabase = event.target.result;

 //checks the database if the user is online to draw transactions from there
  if (navigator.onLine) {
    checkDatabase();
  }
};
//records a pending transaction
function record(record) {
const budget = indexeddatabase.transaction(['pending'], 'readwrite');
const data = budget.objectStore('pending');

data.add(record);
}
//checks indexeddb to upload offline transactions
function checkDatabase() {
const budget = indexeddatabase.transaction(['pending'], 'readwrite');
const data = budget.objectStore('pending');
const read = data.getAll();

//gets transaction objects from the client storage, makes post request, stringifies the object
read.onsuccess = function () {

if (read.result.length > 0) {

fetch("/api/transaction/bulk", {
method: "POST",  
body: JSON.stringify(getAll.result),
headers: {
Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
 },
      })
        .then((response) => response.json())
        .then(()=> {
// accesses the indexeddb objects containing uploaded updates and deletes them

          const budget = indexeddatabase.transaction(["pending"], "readwrite");
          const data = budget.objectStore("pending");

          data.clear();
        });
    }
  };
}

// tries to connect to the database when online
window.addEventListener("online", checkDatabase);
csvarray = [["hi", "you", "idiot"], ["how", "are", "you"], ["fine"], ["well", "great", "right"]]
console.log(csvarray);
let selObj = "test";
csvarray.forEach(function(element){
  //console.log(element[3]);
  if (element.includes("well")){
    selObj = element[1];
    //console.log(selObj);
  }
});

console.log(selObj);

let arrayAdder = [];
let newLength = arrayAdder.push(orange);
console.log(arrayAdder);
console.log(newLength)

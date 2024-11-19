var arr = ["a", "b", "c"]

if(!arr.includes("z")){
    arr.splice(0,0,"z")
}
if(!arr.includes("z")){
    arr.splice(0,0,"z")
}
console.log(arr)

if(arr.includes("z")){
    arr.splice(arr.indexOf("z"), 1)
}
console.log(arr)

class a{
    id;
    constructor(id){
        this.id = id
    }
}

var map = new Map()
map.set(1,new a(1))
map.set(2,new a(2))
map.set(3,new a(3))
map.set(4,new a(4))

var map2 = new Map([...map.entries()].filter(([k,v])=>{v.id > 2}))
console.log(map.get(3))
map2.get(3).id++;
console.log(map.get(3))

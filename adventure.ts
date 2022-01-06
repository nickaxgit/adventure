class Item{
    itemName:string=""
    weight:number=1
    alight:boolean=false //(on fire) 
    broken:boolean=false //(smashed) just examples  of 'states' of objects
    //define other properties (states) for 'items' here
    
    constructor(itemName:string){
        this.itemName = itemName
    }
}

class Place{
    description:string
    nearby:Record<string, Place>={}   //The Record<type,type> is a effectively a 'type safe' Object 
    items:Record<string, Item>={}
    
    constructor(description:string){
        this.description=description
        this.nearby={}
    }
    
    addPlace(direction:string,place:Place){
        this.nearby[direction]=place
        return place // return a reference to the place we just added (so we can chain adds)
    }
 
    fullDescription():string{
        return `
        ${player.place.description}<br>
        You see:-${listProperties(player.place.items)}<br>
        You can go:-${listProperties(player.place.nearby)}<br
        `
    }
}

class Player{
    playerName:string
    inventory:Record<string,Item>
    place:Place
    alive:boolean = true

    constructor(playerName:string,place:Place){
        this.playerName=playerName
        this.inventory={}
        this.place=place
    }
}

function execute(command:string){

    let words= command.toLowerCase().split(" ")

    if ("north,east,south,west,up,down".includes(words[0])){
        player.place=player.place.nearby[words[0]]  //each place has an (nearby) object containing linked places, keyed by their direction
    }
    else if(words[0]=='take'){
        if (player.place.items.hasOwnProperty(words[1])){  //does this players, place, items object have a 'key' (property) with the name in words[1]
            player.inventory[words[1]]=player.place.items[words[1]]  //put the item from the players place .. into the players inventory
            delete player.place.items[words[1]] //remove it from the place           
        }
        else{
            output("I don't see that here")
        }
    }
    else if(words[0]=='drop'){
        if(player.inventory.hasOwnProperty(words[1])){
            //Todo .. drop the thing in question.. in the players current location
        }
        else{
            output ("You're not carrying a " + words[1])
        }
    }
    else if(words[0]=='break'){
        //...    
    }
    //else if ...  etc.. etc.. (examine, throw, say, push, pull, attack)
    else{
        output ("I don't know how to " + words[0])
    }

    output (player.place.fullDescription())
                
}


function output(l:string){
    document.getElementById("main")!.innerHTML += l +"<br/>"
}

function listProperties(o:object):string{

    let r:string=""
    for (let k in o){  //list the string 'keys' (properties) in an object
        r +=k
    }
    return r
}

function keyPressed(e:KeyboardEvent){
    if (e.key=="Enter"){
        execute(commandInput.value)
        commandInput.value=""
    }
}


let graveyard=new Place("You are in a dark graveyard, gravestones poke from the ground at strange angles, and the wind whispers through bare trees")
let church=graveyard.addPlace("north",new Place("You are in the crumbling church, there is a musty smell and brown stains on the wall"))
let eastWing=new Place("You are in the east wing of the church, an open trapdoor leads down into the darkness")
let westWing = new Place("You are in the west wing of the church")

church.addPlace("east",eastWing)
church.addPlace("west",westWing)
eastWing.addPlace("down",new Place("You are in the crypt, it is too dark to see"))

let player = new Player("Thane",graveyard)

let commandInput=<HTMLInputElement>document.getElementById("command")
commandInput.addEventListener("keypress",keyPressed)

output (player.place.fullDescription())
//Next thing to happen will be keyPress() being called by the eventListener on the command input box


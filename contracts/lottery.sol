pragma solidity ^0.4.17; 

contract Lottery {
    address public manager; 
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable { //payable -> when someone calls the function they send ether along
        require(msg.value > .01 ether); // require() - a requirement. Value is converted to wei. However use
        // 'ether' so the program knows it's ether. if false then the entire function is exited
        players.push(msg.sender);
    }
     
     function random() private view returns (uint) {
         return uint(keccak256(block.difficulty, now, players)); 
         // random is pseudo random, therefore its not technically random! 
         
         // sha3 is a global variable therefore no need to import. 
         // sha3 creates a hash and hexadecimal for the arguments
         //same thing as keccak256(), keccak256 is a class, sha3 is 
         //just an instance of it. 
         
         // block is a global variable
         // now returns the current time
         
         // keccak256 returns a hash, however creating a uint function ensure that it returns a uint
     }
     
     function pickWinner() public restricted {
         // restricted is used -> i.e. require(msg.sender == manager);
         // only the manager can call this function
         uint index = random() % players.length; 
         players[index].transfer(this.balance); 
         // addresses have a number of methods attached to it. 
         // transfer() is one of them
         // transfer(1) == transfer 1 wei 
         // transfer(this.balance) == 'this' refers to the instance of the contract. 'balance' == the current balance
         players = new address[](0);
         // empties the list of players
         // creates a new dynamic array of type address
         // (0) == we want it to have an initial size of 0 
     }
     

    modifier restricted() {
        require(msg.sender == manager);
        _;
        // modifiers reduced to amount of code i.e. DRY
        // _; -> takes out the code from the other function and sticks it here to execute
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}

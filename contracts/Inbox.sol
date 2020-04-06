pragma solidity ^0.4.17;
// version of solidity


contract Inbox {
// similar to a class in JS. Deployed versions of the class can be seen as instances.
// like classes, it will have some methods and variables
string public message;
// Declares all of the instance variables.
// "public" => who has access to view the variable

function Inbox (string initialMessage) public {

message = initialMessage;
// Capitalisation. Function has the same name as the contract. Therefore it's a contstructor function.
// Automatically called one time when the contract is created.
 }
function setMessage(string newMessage) public {
message = newMessage;

 }
}

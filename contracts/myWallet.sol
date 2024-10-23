// SPDX-License-Identifier: MIT
// compiler version must be greater than or equal to 0.8.17 and less than 0.9.0
pragma solidity ^0.8.17;

contract myWallet{
    address public owner;
    
    constructor(){
        owner = msg.sender;        
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    mapping(address => uint) public senders;

    error Balance(string message);

    //function for people to deposit money into the contract
    function deposit() public payable {
        assert(msg.value > 0);
        senders[msg.sender] += msg.value;
    }

    // function to withdraw all the balance of the contract
    function withdraw(uint256 _amount) public onlyOwner {
        uint256 amount = _amount * 1 ether;
        if(address(this).balance < amount){
            revert Balance("Insufficient Balance");
        }
        
        payable(owner).transfer(amount);
    }

    // function to check balance of the contract
    function checkBalance() public view onlyOwner returns(uint){
        return address(this).balance;
    }

    // function to send ether to a particular address
    function sendEther(address payable _receiver, uint256 _amount) public onlyOwner {
        require(_receiver != address(0), "Receiver does not exist");
        if(address(this).balance < _amount){
            revert Balance("Insufficient Balance");
        }
        _receiver.transfer(_amount);
    }

    //functions to view amount that has been sent by a particular address
    function amountSent(address _sender) public view returns(uint){
        require(_sender != address(0), "Donor does not exist");
        return senders[_sender];
    }



}

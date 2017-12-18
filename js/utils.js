class BufferFilter  {

  constructor(size) {
    this.size = size;
    this.memory = [];
  }

  insert(word){
    for(var index = 0; index < this.memory.length; index++){
      if(word === this.memory[index]) this.memory = this.memory.slice(0, index).concat(this.memory.slice(index + 1, this.memory.length));
    }
    if(this.memory.push(word) > this.size)
      this.memory = this.memory.slice(-1);
  }

  check(word){
    for(var index = 0; index < this.memory.length; index++){
      if(word === this.memory[index]) return false;
    }
    return true;
  }

}

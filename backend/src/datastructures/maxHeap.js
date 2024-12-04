export default class MaxHeap {
  constructor() {
    this.heap = [];
  }

  heapifyUp(index) {
    let parentIndex = Math.floor((index - 1) / 2);
    if (index > 0 && this.heap[index].key > this.heap[parentIndex].key) {
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      this.heapifyUp(parentIndex);
    }
  }

  heapifyDown(index) {
    let childIndex = 2 * index + 1;
    if (childIndex < this.heap.length) {
      if (childIndex + 1 < this.heap.length && this.heap[childIndex + 1].key > this.heap[childIndex].key) {
        childIndex++;
      }
      if (this.heap[index].key < this.heap[childIndex].key) {
        [this.heap[index], this.heap[childIndex]] = [this.heap[childIndex], this.heap[index]];
        this.heapifyDown(childIndex);
      }
    }
  }

  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }

  delete() {
    if (this.heap.length === 1) {
      return this.heap.pop();
    } else if (this.heap.length > 1) {
      const root = this.heap[0];
      this.heap[0] = this.heap.pop();
      this.heapifyDown(0);
      return root;
    } else {
      return null;
    }
  }

  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  print() {
    console.log(this.heap);
  }
}
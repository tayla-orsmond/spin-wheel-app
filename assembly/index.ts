// Handle the list functionality
// Array for storing items
const items: string[] = [];

// Function to get the list of items
export function getItems(): string[] {
  return items;
}

// Function to add an item to the list
export function addItem(item: string): void {
    if(item.length > 0){
      items.push(item);
    }
}

// Function to clear the list
export function clearItems(): void {
    items.length = 0;
}

// Function to remove an item from the list
export function removeItem(item: string): void {
    const index: i32 = items.indexOf(item) as i32;
    if (index > -1) {
        items.splice(index, 1);
    }
}

export function initialize(): void {
    clearItems();
    addItem("Feed the cat");
    addItem("Buy milk");
    addItem("Do laundry");
}

// Function to spin the wheel
export function spinWheel(): string {
  const items :string [] = getItems();
  if(items.length === 0) {
    return "Add some items first!";
  }
  const index : i32 = Math.floor(Math.random() * items.length) as i32;
  return items[index];
}
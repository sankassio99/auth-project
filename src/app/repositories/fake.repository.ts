import { Injectable, signal } from '@angular/core';

/**
 * A generic fake repository that logs operations and returns mock data
 * Useful for development and testing scenarios
 */
@Injectable({
  providedIn: 'root',
})
export class FakeRepository<T> {
  private items = signal<T[]>([]);

  /**
   * Gets all items in the repository
   */
  getAll(): T[] {
    console.log('FakeRepository: getAll() called');
    return this.items();
  }

  /**
   * Gets an item by id
   * @param id The id of the item to retrieve
   */
  getById(id: string | number): T | undefined {
    console.log(`FakeRepository: getById(${id}) called`);
    return this.items().find((item: any) => item.id === id);
  }

  /**
   * Creates a new item
   * @param item The item to create
   */
  create(item: T): T {
    console.log('FakeRepository: create() called with', item);
    const newItem = { ...item, id: this.generateId() };
    this.items.update((items) => [...items, newItem]);
    return newItem;
  }

  /**
   * Updates an existing item
   * @param id The id of the item to update
   * @param item The updated item data
   */
  update(id: string | number, item: Partial<T>): T | undefined {
    console.log(`FakeRepository: update(${id}) called with`, item);
    let updatedItem: T | undefined;

    this.items.update((items) =>
      items.map((existingItem: any) => {
        if (existingItem.id === id) {
          updatedItem = { ...existingItem, ...item };
          return updatedItem;
        }
        return existingItem;
      })
    );

    return updatedItem;
  }

  /**
   * Deletes an item by id
   * @param id The id of the item to delete
   */
  delete(id: string | number): boolean {
    console.log(`FakeRepository: delete(${id}) called`);
    const initialLength = this.items().length;

    this.items.update((items) => items.filter((item: any) => item.id !== id));

    return initialLength > this.items().length;
  }

  /**
   * Sets mock data for the repository
   * @param mockData The mock data to set
   */
  setMockData(mockData: T[]): void {
    console.log('FakeRepository: setMockData() called with', mockData);
    this.items.set(mockData);
  }

  /**
   * Generates a simple unique id
   * For more complex scenarios, consider using a proper UUID library
   */
  private generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    );
  }
}

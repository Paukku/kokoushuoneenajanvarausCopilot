import { Booker } from '../models';
import { v4 as uuidv4 } from 'uuid';

class BookerRepository {
  private bookers = new Map<string, Booker>();

  getByEmail(email: string): Booker | undefined {
    return this.bookers.get(email.toLowerCase());
  }

  addIfNotExists(email: string, name: string): Booker | null {
    const key = email.toLowerCase();
    const existing = this.bookers.get(key);

    if (existing) {
      return existing.name === name ? existing : null;
    }

    const booker: Booker = {
      uuid: uuidv4(),
      email,
      name
    };

    this.bookers.set(key, booker);
    return booker;
  }

  clear(): void {
    this.bookers.clear();
  }
}

export const bookerRepository = new BookerRepository();

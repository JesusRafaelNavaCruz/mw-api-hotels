/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class DateUtilService {
  addDays(dateString: string, days: number): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
  }
}

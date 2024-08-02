/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateUtilService } from './date-util.service';

@Injectable()
export class AppService {

  constructor(
    private readonly httpService: HttpService, 
    private readonly dateUtilService: DateUtilService,
  ){}

  getHotels(body: any): Observable<any> {
    const url = 'https://vivaaerobus.app.bidflyer.com/api/hotels/standalone/search';
    const headers = {
      'Content-type': 'application/json'
    };

    return this.attemptGetHotels(body, url, headers, 0);
  }

  private attemptGetHotels(body: any, url: string, headers: any, attempts: number): Observable<any> {
    
    if (!this.isValidDate(body.checkIn) || !this.isValidDate(body.checkOut)) {
      throw new BadRequestException("Formato de fecha invalidas")
    }

    return this.httpService.post(url, body, {headers}).pipe(
      map((response: AxiosResponse) => {
        if (!response.data || response.data.length === 0) {
          throw new BadRequestException("Sin resultados")
        }
        
        const limitedData = response.data.slice(0, 4).map((hotel) => ({
          propertyName: hotel.propertyName,
          starsRank: hotel.starsRank,
          totalPrice: hotel.totalPrice,
          currency: hotel.currency,
          hotelToken: hotel.hotelToken,
          images: hotel.images[0].urls.Large
        }));
          
        return limitedData;
      
      }),
      catchError( error => {
        if (attempts < 2) {
          const newCheckInDate = this.dateUtilService.addDays(new Date(body.checkIn), 1);
          const newCheckOutDate = this.dateUtilService.addDays(new Date(body.checkOut), 1);
          body.checkIn = newCheckInDate.toISOString().split('T')[0];
          body.checkOut = newCheckOutDate.toISOString().split('T')[0];
          return this.attemptGetHotels(body, url, headers, attempts + 1);
        } else {
          return throwError(() => new BadRequestException('Sin resultados despues de multiples intentos', error))
        }
      })
    )
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime()); 
  }




  getHello(): string {
    return 'Hello World!';
  }
}

/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {

  constructor(private readonly httpService: HttpService){}

  getHotels(body: any): Observable<any> {
    const url = 'https://vivaaerobus.app.bidflyer.com/api/hotels/standalone/search';
    const headers = {
      'Content-type': 'application/json'
    };

    return this.httpService.post(url, body, { headers })
      .pipe(
        map((response: AxiosResponse) => {
          const limitedData = response.data.slice(0, 4).map((hotel) => ({
            propertyName: hotel.propertyName,
            starsRank: hotel.starsRank,
            totalPrice: hotel.totalPrice,
            currency: hotel.currency,
            hotelToken: hotel.hotelToken,
            images: hotel.images[0].urls.Large
          }));
          console.log(limitedData);
          
          return limitedData;
        })
      )
  }

  getHello(): string {
    return 'Hello World!';
  }
}

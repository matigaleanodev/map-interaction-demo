import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OtmService {
  private readonly OTM_URL = environment.OTM_URL;
  private readonly _http = inject(HttpClient);

  /**
   * Obtiene la dirección basada en latitud y longitud usando la API de OpenStreetMap.
   * @param lat Latitud de la ubicación.
   * @param lon Longitud de la ubicación.
   * @returns Un Observable con los datos de la API.
   */
  getAddress(lat: number, lon: number): Observable<any> {
    const params = {
      format: 'json',
      lat: lat.toString(),
      lon: lon.toString(),
    };
    return this._http.get<any>(`${this.OTM_URL}/reverse`, { params });
  }

  /**
   * Busca una ubicación en OpenStreetMap y mueve el mapa y el marcador.
   * @param query Texto de la búsqueda (ejemplo: "Buenos Aires, Argentina")
   */
  searchLocation(query: string): Observable<any> {
    const params = {
      format: 'json',
      q: query,
    };
    return this._http.get<any>(`${this.OTM_URL}/search`, { params });
  }
}

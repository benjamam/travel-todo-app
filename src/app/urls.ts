import { isDevMode } from '@angular/core';

export const BASE_TRAVEL_URL = isDevMode ? 'http://localhost:8000' : 'https://traveltodoapi.herokuapp.com';

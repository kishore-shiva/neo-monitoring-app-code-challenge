import axios from 'axios';
import { NearEarthObject } from '../models/NearEarthObject';

export const fetchNEOData = async (date: Date): Promise<NearEarthObject[]> => {
    console.log("API: key: " + process.env.EXPO_PUBLIC_NASA_API_KEY);
  try {
    const str_date = date.toISOString().split('T')[0];
    const response = await axios.get(`${process.env.EXPO_PUBLIC_NEO_URL}?start_date=${str_date}&end_date=${str_date}&api_key=${process.env.EXPO_PUBLIC_NASA_API_KEY}`);
    const neoList: NearEarthObject[] = [];
    const neoData = response.data.near_earth_objects[str_date];

    if (neoData) {
      neoData.forEach((obj: any) => {
        const neo = new NearEarthObject(
          obj.id,
          obj.name,
          (obj.estimated_diameter.feet.estimated_diameter_min + obj.estimated_diameter.feet.estimated_diameter_max) / 2,
          obj.is_potentially_hazardous_asteroid,
          parseFloat(obj.close_approach_data[0]?.relative_velocity.miles_per_hour || '0'),
          parseFloat(obj.close_approach_data[0]?.miss_distance.miles || '0')
        );
        neoList.push(neo);
      });
    }
    console.log(neoList);
    return neoList;
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    return [];
  }
};

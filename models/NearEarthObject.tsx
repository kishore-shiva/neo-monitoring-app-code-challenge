export class NearEarthObject {
  id: string;
  name: string;
  diameter: number;
  hazardous: boolean;
  velocity: number;
  missDistance: number;

  constructor(id: string, name: string, diameter: number, hazardous: boolean, velocity: number, missDistance: number) {
    this.id = id;
    this.name = name;
    this.diameter = diameter;
    this.hazardous = hazardous;
    this.velocity = velocity;
    this.missDistance = missDistance;
  }
}

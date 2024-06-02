import { Elevator } from './Elevator';

type RouteSchedulerNode = {
  floor: number;
  passengersEntering: number;
  passengersExiting: number;
  next?: RouteSchedulerNode;
};

class RouteScheduler {
  schedule?: RouteSchedulerNode;

  constructor(private elevator: Elevator) {}

  addRoute() {
    // this will be arbitrary add
  }

  getNextTarget() {
    if (this.schedule) {
      const { floor, passengersEntering, passengersExiting } = this.schedule;
      const response = {
        floor,
        passengersEntering,
        passengersExiting,
      };

      this.schedule = this.schedule?.next;
      return response;
    }
  }
}

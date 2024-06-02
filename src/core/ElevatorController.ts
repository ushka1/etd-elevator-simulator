import { Elevator } from './Elevator';
import {
  DoorClosingCommand,
  DoorsOpeningCommand,
  ElevatorCommand,
  ElevatorMovingCommand,
  PassengerBoardingCommand,
} from './ElevatorCommand';
import { ElevatorRouteNode } from './ElevatorRouteNode';

export class ElevatorController {
  route: ElevatorRouteNode[] = [];
  activeCommand: ElevatorCommand | undefined;
  passengersAhead = 0;

  constructor(private elevator: Elevator) {}

  addTime(time: number) {
    if (!this.activeCommand) {
      this.requestCommand();
    }

    while (this.activeCommand && time) {
      const excess = this.activeCommand.addTime(time);
      time = excess;

      if (this.activeCommand.isCompleted()) {
        this.activeCommand = undefined;
        this.requestCommand();
      }
    }

    return time;
  }

  requestCommand() {
    if (this.route.length === 0) return;
    if (this.activeCommand) return;

    const routeElevation = this.elevator.building.getElevationAtFloorNumber(
      this.route[0].floor,
    );
    if (this.elevator.elevation !== routeElevation) {
      // wrong floor, send elevator to the correct one
      this.activeCommand = new ElevatorMovingCommand(
        this.elevator,
        this.route[0].floor,
      );
    } else {
      // correct floor
      if (
        this.route[0].passengersEntering === 0 &&
        this.route[0].passengersExiting === 0
      ) {
        if (this.elevator.doorsOpened) {
          // no more passengers, close the doors
          const command = new DoorClosingCommand(this.elevator);
          command.once('complete', () => {
            this.route.shift();
          });
          this.activeCommand = command;
        }
      } else {
        if (!this.elevator.doorsOpened) {
          // more passengers, open doors
          this.activeCommand = new DoorsOpeningCommand(this.elevator);
        } else {
          // more passengers, start boarding
          const passengersEntering = this.route[0].passengersEntering ?? 0;
          const passengersExiting = this.route[0].passengersExiting ?? 0;
          const command = new PassengerBoardingCommand(
            this.elevator,
            passengersEntering,
            passengersExiting,
          );
          command.once('complete', () => {
            this.route[0].passengersEntering -= passengersEntering;
            this.route[0].passengersExiting -= passengersExiting;
            this.passengersAhead -= passengersExiting;
          });
          this.activeCommand = command;
        }
      }
    }
  }

  addRoute({
    initialNode,
    initialPrev,
    initialInsertMode,
    finalNode,
    finalPrev,
    finalInsertMode,
  }: RouteData) {
    this.passengersAhead += initialNode.passengersEntering;

    if (initialInsertMode === 'in-place') {
      initialPrev!.passengersEntering += finalNode.passengersExiting;
      initialPrev!.passengersExiting += finalNode.passengersEntering;
    } else {
      if (initialPrev) {
        initialNode.next = initialPrev.next;
        initialPrev.next = initialNode;
      } else {
        initialNode.next = this.route;
        this.route = initialNode;
      }
    }

    if (finalInsertMode === 'in-place') {
      finalPrev.passengersEntering += initialNode.passengersExiting;
      finalPrev.passengersExiting += initialNode.passengersEntering;
    } else {
      finalNode.next = finalPrev.next;
      finalPrev.next = finalNode;
    }
  }

  getPossibleStops(floor: number) {
    let cur = this.route;
    let passegnersAhead = this.passengersAhead;

    while (cur) {
      let requestCost = 0;
      let requestDelay = 0;

      const nxt = cur.next;

      if (!nxt) {
        // add at the end
      } else {
        if (cur.floor <= initialFloor && (!nxt || initialFloor <= nxt.floor)) {
          // fits between

          const desiredDirection = cur.floor < initialFloor ? 1 : -1;
          const currentDirection = nxt ? (cur.floor < nxt?.floor ? 1 : -1) : 0;

          if (currentDirection === 0 || desiredDirection === currentDirection) {
          }
        }
      }

      cur = cur.next;
    }
  }

  findBestRoute(initialFloor: number, finalFloor: number) {
    const possibleRoutes = [];

    // const initialNode = new ElevatorRouteNode({
    //   floor: initialFloor,
    // });
    // const initialElevation = this.elevator.building.getElevationAtFloorNumber(
    //   initialFloor,
    // );
    // const finalNode = new ElevatorRouteNode({
    //   floor: finalFloor,
    // });
    // const finalElevation = this.elevator.building.getElevationAtFloorNumber(
    //   finalFloor,
    // );

    // if (!this.activeCommand) {
    //   let time = calculateTimeToBoard(this.elevator, finalFloor, this.activeCommand)
    //   time += calculateMoveTimeBetweenFloors(this.elevator, initialFloor, finalFloor)
    //   time += calculateTotalServiceTime(this.elevator)

    //   const route: RouteData = {
    //     initialNode,
    //     initialInsertMode: 'after',
    //     initialPrev: undefined,
    //     finalNode,
    //     finalPrev: initialNode,
    //     finalInsertMode: 'after',
    //   };
    //   return route;
    // }

    // if (this.activeCommand.commandType === ElevatorCommandType.ElevatorMoving) {
    //   if(this.elevator.elevation < initialElevation && ) {

    //   }
    // }

    // let cur = this.routeNode;
    // let passengersAtStart = this.passengersAhead;

    // while (cur) {
    //   let requestCost = 0;
    //   let requestDelay = 0;

    //   const nxt = cur.next;

    //   if (!nxt) {
    //     // add at the end
    //   } else {
    //     if (cur.floor <= initialFloor && (!nxt || initialFloor <= nxt.floor)) {
    //       // fits between

    //       const desiredDirection = cur.floor < initialFloor ? 1 : -1;
    //       const currentDirection = nxt ? (cur.floor < nxt?.floor ? 1 : -1) : 0;

    //       if (currentDirection === 0 || desiredDirection === currentDirection) {
    //       }
    //     }
    //   }

    //   cur = cur.next;
    // }
  }
}

type RouteData = {
  initialNode: ElevatorRouteNode;
  initialPrev: ElevatorRouteNode | undefined;
  initialInsertMode: 'in-place' | 'after';
  finalNode: ElevatorRouteNode;
  finalPrev: ElevatorRouteNode;
  finalInsertMode: 'in-place' | 'after';
};

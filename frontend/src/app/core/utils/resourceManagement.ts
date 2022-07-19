import { ReplaySubject, Subject } from "rxjs";

export abstract class ResourceManagement {
  preDestroy = new Subject<boolean>()
  // private replaySubjects: ReplaySubject<any>[] = [];
  // private behaviorSubjects: BehaviorSubject<any>[] = [];

  destroy(): void {
    this.preDestroy.next(true);
    this.preDestroy.complete();
  }

  clean(): void {

  }
}
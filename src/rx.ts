import {Observable} from "rxjs";

const source = new Observable<number>((subscriber) => {
    subscriber.next(2)
    subscriber.complete();
})
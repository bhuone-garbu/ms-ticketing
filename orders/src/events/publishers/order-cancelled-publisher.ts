import { Publisher, Subjects, OrderCancelledEvent } from "@bhuone/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

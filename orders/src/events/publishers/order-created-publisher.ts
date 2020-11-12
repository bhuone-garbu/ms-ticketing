import { Publisher, Subjects, OrderCreatedEvent } from "@bhuone/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

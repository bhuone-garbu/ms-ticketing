import { Publisher, Subjects, TicketUpdatedEvent } from '@bhuone/common';

export class TickerUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

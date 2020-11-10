import { Publisher, Subjects, TicketCreatedEvent } from '@bhuone/common';

export class TickerCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

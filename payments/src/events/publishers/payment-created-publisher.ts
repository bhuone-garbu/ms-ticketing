import { PaymentCreatedEvent, Publisher, Subjects } from '@bhuone/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string,
  title: string,
  price: number;
  // version: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  // version: string;

  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // version: {
  //   type: String,
  //   required: true,
  // },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  const newAttrs: any = { ...attrs, _id: attrs.id };
  delete newAttrs.id;
  return new Ticket(newAttrs);
};

ticketSchema.methods.isReserved = async function () {
  const existingTicket = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ]
    }
  });
  return !!existingTicket;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket, TicketDoc };

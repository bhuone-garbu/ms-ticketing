import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async (done) => {
  const ticket = Ticket.build({
    title: 'test',
    price: 23,
    userId: '123'
  });

  await ticket.save();

  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 20 });
  secondInstance!.set({ price: 60 });

  await firstInstance!.save();

  try {
    await secondInstance!.save();
  } catch (error) {
    return done();
  }

  throw new Error('Should not reach this line');
});

it('increments version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'test',
    price: 23,
    userId: '123'
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});

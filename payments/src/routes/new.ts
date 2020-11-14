import { BadRequestError, NotAuthorized, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@bhuone/common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { stripe } from '../stripe';

const router = Router();

router.post('/api/payments', requireAuth,
  [
    body('stripeToken')
      .not()
      .isEmpty()
      .withMessage('stripToken field is required'),
    body('orderId')
      .not()
      .isEmpty()
      .withMessage('orderId field is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {

    const { stripeToken, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorized();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError('Order already cancelled');

    const stripeCharge = await stripe.charges.create({
      currency: 'gbp',
      amount: order.price * 100,
      source: stripeToken,
    });

    const payment = Payment.build({
      orderId: order.id,
      stripeId: stripeCharge.id
    });

    await payment.save();

    res.status(201).send();
  });

export { router as newPaymentRouter };
